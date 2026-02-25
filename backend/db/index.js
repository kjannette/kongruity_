import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const getPool = () => pool;

export const close = () => pool.end();

export default pool;
