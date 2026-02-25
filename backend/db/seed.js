import 'dotenv/config';
import { query, close } from './index.js';

const notes = [
  { id: 'note_001', text: 'Login flow feels confusing', x: 193, y: 191, author: 'user_5', color: 'yellow' },
  { id: 'note_002', text: 'Login flow is broken on mobile', x: 214, y: 281, author: 'user_9', color: 'yellow' },
  { id: 'note_003', text: 'When I enter my username and password I get an unknown error', x: 189, y: 193, author: 'user_2', color: 'yellow' },
  { id: 'note_004', text: 'Password reset email never arrives', x: 207, y: 267, author: 'user_9', color: 'yellow' },
  { id: 'note_005', text: 'SSO login loops back to the sign-in page', x: 184, y: 124, author: 'user_7', color: 'yellow' },
  { id: 'note_006', text: 'Two-factor code is rejected even when correct', x: 162, y: 213, author: 'user_1', color: 'yellow' },
  { id: 'note_007', text: "I'm logged out unexpectedly after a few minutes", x: 185, y: 157, author: 'user_3', color: 'yellow' },
  { id: 'note_008', text: 'Cannot change my password — save button does nothing', x: 244, y: 188, author: 'user_2', color: 'orange' },
  { id: 'note_009', text: 'Account gets locked too quickly after one failed attempt', x: 280, y: 255, author: 'user_10', color: 'orange' },
  { id: 'note_010', text: 'OAuth consent screen appears every time I sign in', x: 228, y: 124, author: 'user_9', color: 'yellow' },
  { id: 'note_011', text: 'Need better export options (PDF quality is too low)', x: 748, y: 212, author: 'user_9', color: 'green' },
  { id: 'note_012', text: 'Exported PDF cuts off content near the edges', x: 733, y: 159, author: 'user_6', color: 'blue' },
  { id: 'note_013', text: 'Cannot export selected area — only full board exports', x: 696, y: 205, author: 'user_4', color: 'green' },
  { id: 'note_014', text: 'Export takes too long and sometimes never finishes', x: 798, y: 211, author: 'user_2', color: 'green' },
  { id: 'note_015', text: 'Sharing link permissions are confusing', x: 688, y: 290, author: 'user_6', color: 'blue' },
  { id: 'note_016', text: 'Downloaded image is blurry compared to the canvas', x: 677, y: 245, author: 'user_5', color: 'blue' },
  { id: 'note_017', text: 'Exported file names are inconsistent and hard to track', x: 676, y: 201, author: 'user_4', color: 'blue' },
  { id: 'note_018', text: 'No way to schedule recurring exports for stakeholders', x: 661, y: 229, author: 'user_9', color: 'blue' },
  { id: 'note_019', text: "Embedded exports don't update when the board changes", x: 662, y: 132, author: 'user_1', color: 'blue' },
  { id: 'note_020', text: "Can't export comments and reactions with the content", x: 739, y: 139, author: 'user_7', color: 'green' },
  { id: 'note_021', text: 'Board feels slow when there are many sticky notes', x: 341, y: 695, author: 'user_10', color: 'purple' },
  { id: 'note_022', text: 'Canvas freezes for a few seconds when zooming', x: 254, y: 707, author: 'user_8', color: 'pink' },
  { id: 'note_023', text: 'Undo/redo sometimes lags and applies late', x: 236, y: 687, author: 'user_9', color: 'purple' },
  { id: 'note_024', text: 'App crashes when opening a large board', x: 239, y: 597, author: 'user_10', color: 'purple' },
  { id: 'note_025', text: "Saving indicator spins but changes aren't saved", x: 129, y: 781, author: 'user_3', color: 'purple' },
  { id: 'note_026', text: 'Search is slow on boards with lots of content', x: 253, y: 658, author: 'user_2', color: 'pink' },
  { id: 'note_027', text: 'Scrolling stutters on older laptops', x: 178, y: 586, author: 'user_7', color: 'pink' },
  { id: 'note_028', text: 'High CPU usage even when idle on a board', x: 190, y: 695, author: 'user_8', color: 'purple' },
  { id: 'note_029', text: 'Offline mode loses edits when reconnecting', x: 338, y: 632, author: 'user_1', color: 'pink' },
  { id: 'note_030', text: "I see random 'something went wrong' banners with no details", x: 214, y: 594, author: 'user_5', color: 'purple' },
  { id: 'note_031', text: 'Hard to tell who is editing what in real time', x: 761, y: 704, author: 'user_8', color: 'yellow' },
  { id: 'note_032', text: 'Comments get lost — no clear thread view', x: 818, y: 641, author: 'user_5', color: 'yellow' },
  { id: 'note_033', text: "Mentions (@) don't notify the right people", x: 696, y: 669, author: 'user_5', color: 'yellow' },
  { id: 'note_034', text: 'Too many notification emails for minor edits', x: 769, y: 739, author: 'user_9', color: 'yellow' },
  { id: 'note_035', text: 'No notification when someone resolves my comment', x: 673, y: 636, author: 'user_2', color: 'blue' },
  { id: 'note_036', text: 'Cursor presence is distracting and overlaps content', x: 788, y: 605, author: 'user_5', color: 'yellow' },
  { id: 'note_037', text: "Can't easily hand off facilitation to another user", x: 816, y: 707, author: 'user_2', color: 'yellow' },
  { id: 'note_038', text: 'Live follow mode frequently breaks', x: 710, y: 579, author: 'user_9', color: 'yellow' },
  { id: 'note_039', text: "Guest collaborators can't see updates without refreshing", x: 759, y: 711, author: 'user_9', color: 'yellow' },
  { id: 'note_040', text: 'Activity feed lacks context about what changed', x: 710, y: 771, author: 'user_7', color: 'yellow' },
  { id: 'note_041', text: 'Hard to find the right template quickly', x: 536, y: 394, author: 'user_4', color: 'orange' },
  { id: 'note_042', text: 'Template search results feel irrelevant', x: 400, y: 474, author: 'user_6', color: 'orange' },
  { id: 'note_043', text: "Can't organize boards into folders the way I need", x: 504, y: 398, author: 'user_4', color: 'green' },
  { id: 'note_044', text: "Naming conventions aren't enforced and things get messy", x: 469, y: 434, author: 'user_9', color: 'green' },
  { id: 'note_045', text: 'No bulk rename for multiple sticky notes', x: 455, y: 427, author: 'user_1', color: 'green' },
  { id: 'note_046', text: 'Tags are missing — I need better categorization', x: 472, y: 435, author: 'user_6', color: 'green' },
  { id: 'note_047', text: 'Hard to keep consistent styles across boards', x: 420, y: 426, author: 'user_8', color: 'green' },
  { id: 'note_048', text: 'Duplicating a board loses some formatting', x: 382, y: 410, author: 'user_10', color: 'orange' },
  { id: 'note_049', text: 'Need better controls for aligning and distributing notes', x: 462, y: 487, author: 'user_7', color: 'green' },
  { id: 'note_050', text: "Can't lock sections to prevent accidental edits during workshops", x: 521, y: 471, author: 'user_6', color: 'orange' },
];

const run = async () => {
  try {
    const insertQuery = `
      INSERT INTO notes (id, text, x, y, author, color)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `;

    let inserted = 0;
    for (const note of notes) {
      const result = await query(insertQuery, [
        note.id,
        note.text,
        note.x,
        note.y,
        note.author,
        note.color,
      ]);
      inserted += result.rowCount;
    }

    console.log(`Seed complete — ${inserted} notes inserted (${notes.length - inserted} already existed).`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await close();
  }
};

run();
