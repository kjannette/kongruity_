/**
 * Structural validation: confirms the LLM output is well-formed
 * before it reaches the frontend.
 *
 * @param {Array<{label: string, noteIds: string[]}>} clusters
 * @param {string[]} inputNoteIds - the original note IDs that were sent to the LLM
 * @returns {{valid: boolean, reasons: string[]}}
 */
export const validateStructure = (clusters, inputNoteIds) => {
  const reasons = [];

  if (!Array.isArray(clusters) || clusters.length === 0) {
    return { valid: false, reasons: ['Response is not a non-empty array'] };
  }

  const assignedIds = [];
  for (const cluster of clusters) {
    if (!cluster.label || typeof cluster.label !== 'string') {
      reasons.push(`Cluster missing a valid label`);
    }
    if (!Array.isArray(cluster.noteIds) || cluster.noteIds.length === 0) {
      reasons.push(`Cluster "${cluster.label ?? '(unlabeled)'}" has no noteIds`);
    }
    assignedIds.push(...(cluster.noteIds ?? []));
  }

  const inputSet = new Set(inputNoteIds);
  const assignedSet = new Set(assignedIds);

  if (assignedIds.length !== assignedSet.size) {
    reasons.push('One or more notes appear in multiple clusters');
  }

  const missing = inputNoteIds.filter((id) => !assignedSet.has(id));
  if (missing.length > 0) {
    reasons.push(`Notes missing from clusters: ${missing.join(', ')}`);
  }

  const extra = assignedIds.filter((id) => !inputSet.has(id));
  if (extra.length > 0) {
    reasons.push(`Unknown noteIds in clusters: ${[...new Set(extra)].join(', ')}`);
  }

  if (clusters.length > inputNoteIds.length) {
    reasons.push(`More clusters (${clusters.length}) than notes (${inputNoteIds.length})`);
  }

  return { valid: reasons.length === 0, reasons };
};

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
};

/**
 * Computes a silhouette-style cohesion score for the clustering.
 *
 * For each note, measures how much more similar it is to its own cluster
 * versus the nearest neighboring cluster. Returns a score in [-1, 1]
 * where higher is better.
 *
 * @param {Array<{label: string, noteIds: string[]}>} clusters
 * @param {Map<string, number[]>} embeddingMap - noteId → vector
 * @returns {number} average silhouette score
 */
export const computeCohesionScore = (clusters, embeddingMap) => {
  if (clusters.length <= 1) return 1.0;

  const scores = [];

  for (let ci = 0; ci < clusters.length; ci++) {
    const clusterIds = clusters[ci].noteIds;
    if (clusterIds.length <= 1) {
      scores.push(0);
      continue;
    }

    for (const noteId of clusterIds) {
      const vec = embeddingMap.get(noteId);
      if (!vec) continue;

      // a(i): avg distance to other notes in same cluster
      let intraSum = 0;
      let intraCount = 0;
      for (const otherId of clusterIds) {
        if (otherId === noteId) continue;
        const otherVec = embeddingMap.get(otherId);
        if (!otherVec) continue;
        intraSum += 1 - cosineSimilarity(vec, otherVec);
        intraCount++;
      }
      const a = intraCount > 0 ? intraSum / intraCount : 0;

      // b(i): min avg distance to notes in any other cluster
      let b = Infinity;
      for (let oi = 0; oi < clusters.length; oi++) {
        if (oi === ci) continue;
        const otherClusterIds = clusters[oi].noteIds;
        let interSum = 0;
        let interCount = 0;
        for (const otherId of otherClusterIds) {
          const otherVec = embeddingMap.get(otherId);
          if (!otherVec) continue;
          interSum += 1 - cosineSimilarity(vec, otherVec);
          interCount++;
        }
        if (interCount > 0) {
          b = Math.min(b, interSum / interCount);
        }
      }
      if (b === Infinity) b = 0;

      const max = Math.max(a, b);
      scores.push(max === 0 ? 0 : (b - a) / max);
    }
  }

  if (scores.length === 0) return 0;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
};
