 import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
  user: 'hoadev',
  password: 'hoadev123',
  host: 'localhost',
  port: 5432,
  database: 'hoadev_db',
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