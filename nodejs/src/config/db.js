 import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
  user: proccess.env.PROD_DB_USER,
  password: proccess.env.PROD_DB_PASSWORD,
  host:proccess.env.PROD_DB_HOST,
  port: proccess.env.PROD_DB_PORT || 5432,
  database: proccess.env.PROD_DB_NAME,
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