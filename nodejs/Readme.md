***Cài đặt thư viện Nodejs***

- Chúng ta cần cài các thư viện như: express, pg, dotenv, cors, nodemon

```bash
    npm init -y
    npm install express pg dotenv cors nodemon
```

Sau khi cài xong chúng ta sẽ tạo một file server.js
 `src/server.js`

 ```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hoa Nguyen Coder!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

 ```

Sau đó chúng ta cần cấu hình nodemon, để khi chúng ta sửa file, thì nó tự build lại, hãy mở file `package.json` lên sửa lại

```bash
 "dev": "nodemon src/server.js",
```

Sau đó chúng ta chạy lệnh sau, để run project

```bash
npm run dev
```

- Nếu mọi thứ chạy được, tiếp theo ta sẽ cấu hình postgresql, để nodejs connect được postgresql

- tạo file db.js trong thư mục config
`https://node-postgres.com/features/connecting`

+ `src/config/db.js`
```bash
import pg from 'pg'
const { Pool } = pg
const pool = new Pool()
const res = await pool.query('SELECT * FROM users WHERE id = $1', [1])
console.log('user:', res.rows[0])
```

hoặc dùng cách sao, ta cần phải tạo file .env

```bash
DATABASE_URL="postgresql://hoadev:hoadev123@localhost:5432/hoadev_db?schema=public"
```

+ `src/config/db.js`
```bash
 import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool; 
```


Chúng ta có thể gọi nó trong server.js
```bash
//import connect postgreql
import('./config/db.js')
```

Nếu báo lỗi `type "module"`, ta sẽ cần chỉnh sửa lại package.json 
```"type": "module"```
Rồi các require , đổi thành import 
`Example:`
```bash
import express from 'express'
```

***TẠO ROUTE CHO USER VÀ POST***

`routes/user.routes.js`
```bash
import express from 'express'
const router = express.Router()

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router

```

Chúng ta test xem chạy được không, nếu ok thì ta sẽ update code user.routes.js lại như sau:
https://expressjs.com/en/guide/routing.html

```bash
import express from 'express'
const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
  res.send('get all user')
})
// define the about route
router.get('/:id', (req, res) => {
  res.send('get user id')
})

router.post('/', (req, res) => {
  res.send('create user')
})

router.put('/:id', (req, res) => {
  res.send('update user')
})

router.delete('/:id', (req, res) => {
  res.send('delete user')
})
export default router
```
Okay, bây giờ việc của chúng ta là viết crud cho user, chúng ta cần import connect đến postgresql vào file user.routes.js, để xử lý việc thêm
`https://node-postgres.com/features/pooling`

+ `src/routes/user.routes.js`

```bash
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

```
+ `src/routes/post.routes.js`
```bash
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

```

**FIX LỖI CORS**
```
users:1 Access to fetch at 'http://localhost:3000/api/users' from origin 'http://localhost:9000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
:3000/api/users:1  Failed to load resource: net::ERR_FAILED
forward-logs-shared.ts:95 [Fast Refresh] done in 182ms
users:1 Access to fetch at 'http://localhost:3000/api/users' from origin 'http://localhost:9000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
fetcher.ts:1  GET http://localhost:3000/api/users net::ERR_FAILED 404 (Not Found)

```

Chúng ta mở file server.js lên cấu hình cors
`https://www.npmjs.com/package/cors`

```bash
import cors from 'cors';
// Bật CORS cho tất cả domain
app.use(cors());
// Nếu muốn giới hạn domain:
app.use(cors({
  origin: ['http://localhost:9000', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```
---------------------
Advanced CI/CD Pipeline
This example demonstrates a complete CI/CD pipeline that includes:

Code checkout
Dependency installation with caching
Linting and type checking (for TypeScript projects)
Running tests with coverage
Building the application
Deploying to a staging environment on push to main
Manual approval for production deployment