import pool from './config/db.js'; // Điều chỉnh đường dẫn cho đúng file db.js của bạn

async function showDatabaseData() {
  console.log('🚀 Đang kết nối để lấy dữ liệu...');
  
  try {
    const client = await pool.connect();

    // 1. Lấy dữ liệu từ bảng User và Profile (Quan hệ 1:1)
    console.log('\n--- 👥 DANH SÁCH NGƯỜI DÙNG & BIO ---');
    const userQuery = `
      SELECT u.id, u.name, u.email, p.bio 
      FROM "User" u
      LEFT JOIN "Profile" p ON u.id = p."userId"
      ORDER BY u.id ASC;
    `;
    const users = await client.query(userQuery);
    console.table(users.rows); // Dùng console.table để hiển thị dạng bảng cực đẹp

    // 2. Lấy dữ liệu từ bảng Post và tác giả (Quan hệ n:1)
    console.log('\n--- 📝 DANH SÁCH BÀI VIẾT (POSTS) ---');
    const postQuery = `
      SELECT pt.id, pt.title, pt.published, u.name as author
      FROM "Post" pt
      JOIN "User" u ON pt."authorId" = u.id
      ORDER BY pt.id ASC;
    `;
    const posts = await client.query(postQuery);
    console.table(posts.rows);

    client.release();
  } catch (err) {
    console.error('❌ Lỗi khi đọc dữ liệu:', err.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

showDatabaseData();