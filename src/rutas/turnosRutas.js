import express from 'express';

import {
    crearTurno,
    crearTurnoAdmin,
    listarMisTurnos,
    marcarAtendido
} from '../controladores/turnosControlador.js';

import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { validarCampos } from '../middlewares/validar_campos.js';

import { body } from 'express-validator';

const router = express.Router();


// PACIENTE - Crear turno propio
router.post('/',

    requiere_permiso({
        add: { turnos: ['owned'] }
    }),

    body('fecha_hora')
        .notEmpty().withMessage('La fecha y hora son obligatorias'),

    body('id_medico')
        .isInt().withMessage('El id_medico debe ser numérico'),

    validarCampos,

    crearTurno
);


// ADMIN - Crear turno para cualquier paciente
router.post('/admin',

    requiere_permiso({
        add: { turnos: ['*'] }
    }),

    body('fecha_hora')
        .notEmpty().withMessage('La fecha y hora son obligatorias'),

    body('id_medico')
        .isInt().withMessage('El id_medico debe ser numérico'),

    body('id_paciente')
        .isInt().withMessage('El id_paciente debe ser numérico'),

    validarCampos,

    crearTurnoAdmin
);


// MÉDICO y PACIENTE - Ver sus turnos
router.get('/mis-turnos',

    requiere_permiso({
        browse: { turnos: ['owned'] }
    }),

    listarMisTurnos
);


// MÉDICO - Marcar turno como atendido
// La URL usa "atentido" porque así está la columna en la BD
router.put('/:id/atentido',

    requiere_permiso({
        edit: { turnos: ['atendido'] }
    }),

    marcarAtendido
);

/**
 * @swagger
 * /api/v1/turnos/mis-turnos:
 *   get:
 *     summary: Obtiene los turnos del usuario autenticado
 *     tags:
 *       - Turnos
 *     responses:
 *       200:
 *         description: Lista de turnos
 */

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear turno propio
 *     tags:
 *       - Turnos
 */

/**
 * @swagger
 * /api/v1/turnos/admin:
 *   post:
 *     summary: Crear turno como administrador
 *     tags:
 *       - Turnos
 */

/**
 * @swagger
 * /api/v1/turnos/mis-turnos:
 *   get:
 *     summary: Listar mis turnos
 *     tags:
 *       - Turnos
 */

/**
 * @swagger
 * /api/v1/turnos/{id}/atentido:
 *   put:
 *     summary: Marcar turno como atendido
 *     tags:
 *       - Turnos
 */

router.get(
    '/mis-turnos',
    requiere_permiso({
        browse: { turnos: ['owned'] }
    }),
    listarMisTurnos
);
import { obtenerEstadisticas, descargarInformePDF } from '../controladores/reportesControlador.js';


/**
 * @swagger
 * /api/v1/turnos/admin/estadisticas:
 * get:
 * summary: Obtener estadísticas globales desde Stored Procedure
 * tags: [Turnos]
 * security:
 * - bearerAuth: []
 */
router.get('/admin/estadisticas',
    requiere_permiso({ browse: { estadisticas: ["*"] } }),
    obtenerEstadisticas
);

/**
 * @swagger
 * /api/v1/turnos/admin/informe-pdf:
 * get:
 * summary: Descargar reporte ejecutivo en formato PDF
 * tags: [Turnos]
 * security:
 * - bearerAuth: []
 */
router.get('/admin/informe-pdf',
    requiere_permiso({ browse: { turnos: ["*"] } }),
    descargarInformePDF
);

export default router;