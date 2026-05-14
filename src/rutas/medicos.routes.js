import express from 'express';

import {
    listarMedicos,
    obtenerMedico,
    agregarMedico,
    actualizarMedico,
    eliminarMedico
} from '../controladores/medicosControlador.js';

import { body } from 'express-validator';

const router = express.Router();


// LISTAR
router.get('/',
    listarMedicos
);


// OBTENER UNO
router.get('/:id',
    obtenerMedico
);


// AGREGAR
router.post('/',

    body('id_usuario')
        .notEmpty().withMessage('El id_usuario es obligatorio'),

    body('id_especialidad')
        .notEmpty().withMessage('La especialidad es obligatoria'),

    body('matricula')
        .notEmpty().withMessage('La matrícula es obligatoria'),

    body('valor_consulta')
        .notEmpty().withMessage('El valor de consulta es obligatorio'),

    agregarMedico
);


// ACTUALIZAR
router.put('/:id',

    body('id_especialidad')
        .notEmpty().withMessage('La especialidad es obligatoria'),

    body('matricula')
        .notEmpty().withMessage('La matrícula es obligatoria'),

    body('valor_consulta')
        .notEmpty().withMessage('El valor de consulta es obligatorio'),

    actualizarMedico
);


// ELIMINAR
router.delete('/:id',
    eliminarMedico
);

export default router;
