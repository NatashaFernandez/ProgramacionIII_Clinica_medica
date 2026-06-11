import mysql from 'mysql2/promise';
import * as fs from "fs";

process.loadEnvFile('./.env'); 

const pool = mysql.createPool({
    host: process.env.DB_SERVIDOR,
    user: process.env.DB_USUARIO,
    port: process.env.DB_PUERTO,
    password: process.env.DB_CONTRASENA,
    database: process.env.DB_NOMBRE,
    ssl: process.env.HABILITAR_SSL === 'true' ? {
        minVersion: 'TLSv1.2',
        ca: process.env.RUTA_CA_CERTIFICADO ? fs.readFileSync(process.env.RUTA_CA_CERTIFICADO) : undefined
    } : null,
});

export default pool;