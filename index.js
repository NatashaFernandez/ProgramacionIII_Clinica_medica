// Carga de variables de entorno 
process.loadEnvFile();

import express from 'express';

const app = express();

//  Middleware para manejar JSON
app.use(express.json());

//  Ruta base de bienvenida (Para probar que la API funciona)
app.get('/', (req, res) => {
    res.json({
        mensaje: "API Clínica Médica - TFI Programación III",
        estado: "En línea",
        version: "1.0.0"
    });
});

// Configuración del puerto
const PORT = process.env.PUERTO || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});