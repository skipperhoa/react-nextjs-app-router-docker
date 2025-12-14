import express from 'express'

//import connect postgreql
import pool from '../config/db.js'

const router = express.Router()

// define the home page route
router.get('/', async (req, res) => {
   const user = await pool.query('SELECT * FROM "User" order by id desc')  
   res.json(user.rows)
})
// define the about route
router.get('/:id', async (req, res) => {
  const user = await pool.query('SELECT * FROM "User" WHERE id = $1', [req.params.id])  
  res.json(user.rows[0])
})

router.post('/', (req, res) => {
  const text = 'INSERT INTO "User"(name, email) VALUES($1, $2) RETURNING *'
  const values = [req.body.name, req.body.email]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
})

router.put('/:id', (req, res) => {
  const text = 'UPDATE "User" SET name = $1, email = $2 WHERE id = $3 RETURNING *'
  const values = [req.body.name, req.body.email, req.params.id]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User update with ID: ${results.rows[0].id}`)
  })
})

router.delete('/:id', (req, res) => {
  const text = 'DELETE FROM "User" WHERE id = $1 RETURNING *'
  const values = [req.params.id]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Delete user with ID: ${results.rows[0].id}`)
  })
})
export default router
