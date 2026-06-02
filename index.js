
// Carga de variables de entorno
process.loadEnvFile();

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { requiere_session } from './src/middlewares/requiere_session.js';


// Importación de rutas 
import especialidadesRutas from './src/rutas/especialidadesRutas.js';
import obrasSocialesRutas from './src/rutas/obrasSocialesRutas.js';
import authRutas from './src/rutas/authRutas.js';
import usuariosRutas from './src/rutas/usuariosRutas.js';
import turnosRutas from './src/rutas/turnosRutas.js';



const app = express();

// MIDDLEWARE de CORS para permitir conexiones externas
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// MIDDLEWARE para parsear JSON (Necesario para que funcionen los métodos POST y PUT)
app.use(express.json());

// MIDDLEWARE Morgan "observa"
app.use(morgan('dev'));

// Rutas públicas (No requieren sesión)
app.use('/auth', authRutas);
// Rutas de usuarios
app.use('/usuarios', usuariosRutas);

// Rutas protegidas por sesión

// El MIDDLEWARE requiere_session se asegura de que haya un usuario logueado antes de chequear permisos
app.use('/especialidades', requiere_session, especialidadesRutas);
app.use('/obras_sociales', requiere_session, obrasSocialesRutas);
app.use('/turnos', requiere_session, turnosRutas);


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
