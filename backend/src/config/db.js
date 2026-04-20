import pg from 'pg';

const { Pool } = pg;

// Initialize connection pool dynamically
// If process.env.DATABASE_URL exists, use it (e.g. for Supabase)
// Otherwise fallback to local PostgreSQL environment variables
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

export const pool = new Pool(poolConfig);
//function to verify db connectivity (used in server.js)
export const connectDB = async () => {
  try {
    //acquire and release a client for connection check
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
    client.release(); //release the client back to the pool
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); //terminate process on connection failure
  }
};

//expose query helper for repository layer
export const query = (text, params) => pool.query(text, params);
