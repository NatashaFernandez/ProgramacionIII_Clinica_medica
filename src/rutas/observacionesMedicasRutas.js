import express from 'express';

import {
    agregarObservacion,
    listarObservaciones
} from '../controladores/observacionesMedicasControlador.js';

import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validar_campos.js';

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