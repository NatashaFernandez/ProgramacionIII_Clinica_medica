// Carga de variables de entorno
process.loadEnvFile();

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/configuracion/swagger.js';
import { requiere_session } from './src/middlewares/requiere_session.js';

// Importación de rutas
import authRutas from './src/rutas/authRutas.js';
import turnosRutas from './src/rutas/turnosRutas.js';
import medicosRutas from './src/rutas/medicosRutas.js';
import usuariosRutas from './src/rutas/usuariosRutas.js';
import pacientesRutas from './src/rutas/pacientesRutas.js';
import obrasSocialesRutas from './src/rutas/obrasSocialesRutas.js';
import especialidadesRutas from './src/rutas/especialidadesRutas.js';
import observacionesMedicasRutas from './src/rutas/observacionesMedicasRutas.js';

const app = express();

// MIDDLEWARE de CORS para permitir conexiones externas
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// MIDDLEWARE para parsear JSON
app.use(express.json());

// MIDDLEWARE Morgan
app.use(morgan('dev'));


// Públicas
app.use('/api/v1/auth', authRutas);

// Protegidas
app.use('/api/v1/turnos', requiere_session, turnosRutas);
app.use('/api/v1/medicos', requiere_session, medicosRutas);
app.use('/api/v1/usuarios', requiere_session,  usuariosRutas);
app.use('/api/v1/pacientes', requiere_session, pacientesRutas);
app.use('/api/v1/obras_sociales', requiere_session, obrasSocialesRutas);
app.use('/api/v1/especialidades', requiere_session, especialidadesRutas);
app.use('/api/v1/observaciones', requiere_session, observacionesMedicasRutas);

// Ruta raíz
app.get('/', (req, res) => {
    res.status(200).json({
        api: "Clínica Grupo AC",
        version: "v1",
        mensaje: "Bienvenido a la API de la Clínica",
        estado: "Servidor funcionando correctamente",
        entidades: [
            "Usuarios",
            "Especialidades",
            "Obras Sociales",
            "Médicos",
            "Turnos",
            "Observaciones Médicas"
        ]
    });
});

// Documentacion Swagger

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

const PORT = process.env.PUERTO || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
