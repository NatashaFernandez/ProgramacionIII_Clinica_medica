import express from 'express';
import { 
    listarEspecialidades, 
    obtenerEspecialidad, 
    actualizarEspecialidad, 
    agregarEspecialidad, 
    eliminarEspecialidad 
} from '../controladores/especialidadesControlador.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validar_campos.js';

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar especialidades
 *     tags:
 *       - Especialidades
 *     responses:
 *       200:
 *         description: Lista de especialidades
 */

/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Obtener especialidad por ID
 *     tags:
 *       - Especialidades
 */

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crear especialidad
 *     tags:
 *       - Especialidades
 */

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Actualizar especialidad
 *     tags:
 *       - Especialidades
 */

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Eliminar especialidad
 *     tags:
 *       - Especialidades
 */


const router = express.Router();

router.get('/', requiere_permiso({ browse: { especialidades: ["*"] } }), listarEspecialidades);
router.get('/:id', requiere_permiso({ read: { especialidades: ["*"] } }), obtenerEspecialidad);
router.post('/',
    requiere_permiso({ add: { especialidades: ["*"] } }),

    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio'),

    validarCampos,

    agregarEspecialidad
);
router.put('/:id',
    requiere_permiso({ edit: { especialidades: ["*"] } }),

    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio'),

    validarCampos,

    actualizarEspecialidad
);
router.delete('/:id', requiere_permiso({ delete: { especialidades: ["soft"] } }), eliminarEspecialidad);

export default router;