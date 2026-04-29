
// Carga de variables de entorno
process.loadEnvFile();

import express from 'express';
import morgan from 'morgan';

// Importación de rutas 
import especialidadesRutas from './src/rutas/especialidadesRutas.js';

const app = express();

// MIDDLEWARE para parsear JSON (Necesario para que funcionen los métodos POST y PUT)
app.use(express.json());

//Configuración de Morgan
app.use(morgan('dev'));

// RUTA DE ESPECIALIDADES
app.use('/especialidades', especialidadesRutas);

// Ruta raíz (Bienvenida)
app.get('/', (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API de la Clínica - Grupo AC. Estamos para ayudarlo.",
        estado: "Servidor funcionando correctamente",
        entidades: ["/especialidades", "/medicos", "/obras_sociales","/medicos_obras_sociales", "/pacientes", "/turnos_reservas", "/usuarios"]
    });
});

const PORT = process.env.PUERTO || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});