import mysql from 'mysql2/promise';

process.loadEnvFile('./.env'); 

const pool = mysql.createPool({
    host: process.env.DB_SERVIDOR,
    user: process.env.DB_USUARIO,
    password: process.env.DB_CONTRASENA,
    database: process.env.DB_NOMBRE
});

export default pool;