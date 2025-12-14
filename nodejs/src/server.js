import express from 'express'
import cors from 'cors'
const app = express()
const port = 9000

//import routes
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'

app.use(express.json())
app.use(cors());
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
