import express from 'express'

//import connect postgreql
import pool from '../config/db.js'

const router = express.Router()

// define the home page route
router.get('/', async (req, res) => {
   const post = await pool.query('SELECT * FROM "Post" order by id desc')  
   res.json(post.rows)
})
// define the about route
router.get('/:id', async (req, res) => {
  const post = await pool.query('SELECT * FROM "Post" WHERE id = $1', [req.params.id])  
  res.json(post.rows[0])
})

router.post('/', (req, res) => {
  const text = 'INSERT INTO "Post"(title, content,published,"authorId") VALUES($1, $2, $3, $4) RETURNING *'
  const values = [req.body.title, req.body.content, req.body.published, req.body.authorId]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Post added with ID: ${results.rows[0].id}`)
  })
})

router.put('/:id', (req, res) => {
  const text = 'UPDATE "Post" SET title = $1, content = $2 WHERE id = $3 RETURNING *'
  const values = [req.body.title, req.body.content, req.params.id]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Post update with ID: ${results.rows[0].id}`)
  })
})

router.delete('/:id', (req, res) => {
  const text = 'DELETE FROM "Post" WHERE id = $1 RETURNING *'
  const values = [req.params.id]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Delete post with ID: ${results.rows[0].id}`)
  })
})
export default router
