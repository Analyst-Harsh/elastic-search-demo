import mysql from 'mysql2/promise'


// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'your_user',
  password: process.env.DB_PASSWORD ?? 'your_password',
  database: process.env.DB_NAME ?? 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;