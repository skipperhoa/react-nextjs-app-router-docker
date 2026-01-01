 import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'hoadev',
  password: process.env.POSTGRES_PASSWORD || 'hoadev123',
  database: process.env.POSTGRES_DB || 'hoadev_db',
  port: process.env.POSTGRES_PORT || 5432,
})

export default pool

 
/*  import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool; */