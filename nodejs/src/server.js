import express from 'express'
import cors from 'cors'
import pool from './config/db.js' // Import pool để kiểm tra kết nối

// import routes
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'

const app = express()
const port = 9000

app.use(express.json())
app.use(cors())

// Routes API
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

// Trang chủ hiển thị trạng thái hệ thống
app.get('/', async (req, res) => {
    let dbStatus = '🔴 Disconnected';
    let dbInfo = {};

    try {
        // Thử query lấy thời gian từ DB để check kết nối
        const result = await pool.query('SELECT NOW(), current_database(), user');
        dbStatus = '🟢 Connected';
        dbInfo = {
            time: result.rows[0].now,
            database: result.rows[0].current_database,
            user: result.rows[0].user,
            host: process.env.DB_HOST || 'localhost'
        };
    } catch (err) {
        dbStatus = `🔴 Error: ${err.message}`;
    }

    // Trả về giao diện HTML cơ bản để bạn dễ nhìn
    res.send(`
        <html>
            <head>
                <title>NodeJS - Postgres Dashboard</title>
                <style>
                    body { font-family: sans-serif; line-height: 1.6; padding: 20px; background: #f4f4f4; }
                    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                    .status { font-weight: bold; font-size: 1.2em; }
                    .info { background: #eee; padding: 10px; border-radius: 4px; margin-top: 10px; }
                    ul { list-style: none; padding: 0; }
                    li { margin-bottom: 10px; }
                    a { color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🚀 Node.js App Dashboard</h1>
                    <p class="status">Database Status: ${dbStatus}</p>
                    
                    ${dbStatus.includes('🟢') ? `
                        <div class="info">
                            <strong>Database Info:</strong><br>
                            - Host: ${dbInfo.host}<br>
                            - Name: ${dbInfo.database}<br>
                            - User: ${dbInfo.user}<br>
                            - DB Time: ${dbInfo.time}
                        </div>
                    ` : ''}

                    <hr>
                    <h3>🔗 Quick Links (API Routes):</h3>
                    <ul>
                        <li>👉 <a href="/api/users">View All Users (JSON)</a></li>
                        <li>👉 <a href="/api/posts">View All Posts (JSON)</a></li>
                    </ul>
                </div>
            </body>
        </html>
    `);
})

app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`)
    console.log(`📡 Connecting to DB at: ${process.env.POSTGRES_HOST}`)
})