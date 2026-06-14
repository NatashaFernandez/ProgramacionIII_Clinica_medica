import express from 'express';

import {agregarObservacion,listarObservaciones} from '../controladores/observacionesMedicasControlador.js';

import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validar_campos.js';

/**
 * @swagger
 * /api/v1/observaciones/{id}:
 *   post:
 *     summary: Agregar una observación médica a un turno
 *     tags:
 *       - Observaciones Médicas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del turno
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observacion:
 *                 type: string
 *                 example: "Paciente con buena evolución. Se indica reposo por 48 horas."
 *     responses:
 *       201:
 *         description: Observación registrada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Permisos insuficientes
 */

/**
 * @swagger
 * /api/v1/observaciones/{id}:
 *   get:
 *     summary: Obtener las observaciones de un turno
 *     tags:
 *       - Observaciones Médicas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del turno
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de observaciones
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Turno no encontrado
 */

const router = express.Router();


// MÉDICO - Agregar observación a un turno
router.post(
    '/:id',

    requiere_permiso({
        edit: {
            turnos: ['atendido']
        }
    }),

    body('observacion')
        .notEmpty()
        .withMessage('La observación es obligatoria'),

    validarCampos,

    agregarObservacion
);


// MÉDICO - Ver observaciones de un turno
router.get(
    '/:id',

    requiere_permiso({
        browse: {
            turnos: ['owned']
        }
    }),

    listarObservaciones
);

export default router;