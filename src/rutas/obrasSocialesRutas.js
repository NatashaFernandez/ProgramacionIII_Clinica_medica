import express from 'express';
import { 
    listarObrasSociales, 
    obtenerObraSocial, 
    agregarObraSocial, 
    actualizarObraSocial, 
    eliminarObraSocial 
} from '../controladores/obrasSocialesControlador.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validar_campos.js';

/**
 * @swagger
 * /api/v1/obras_sociales:
 *   get:
 *     summary: Listar obras sociales
 *     tags:
 *       - Obras Sociales
 */

/**
 * @swagger
 * /api/v1/obras_sociales/{id}:
 *   get:
 *     summary: Obtener obra social por ID
 *     tags:
 *       - Obras Sociales
 */

/**
 * @swagger
 * /api/v1/obras_sociales:
 *   post:
 *     summary: Crear obra social
 *     tags:
 *       - Obras Sociales
 */

/**
 * @swagger
 * /api/v1/obras_sociales/{id}:
 *   put:
 *     summary: Actualizar obra social
 *     tags:
 *       - Obras Sociales
 */

/**
 * @swagger
 * /api/v1/obras_sociales/{id}:
 *   delete:
 *     summary: Eliminar obra social
 *     tags:
 *       - Obras Sociales
 */

const router = express.Router();

router.get('/', requiere_permiso({ browse: { obras_sociales: ["*"] } }), listarObrasSociales);
router.get('/:id', requiere_permiso({ read: { obras_sociales: ["*"] } }), obtenerObraSocial);
router.post(
  '/',
  requiere_permiso({ add: { obras_sociales: ["*"] } }),

  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('Debe ser texto'),

  body('descripcion')
    .optional()
    .isString().withMessage('Debe ser texto'),

  body('porcentaje_descuento')
    .optional()
    .isNumeric().withMessage('Debe ser un número'),

  body('es_particular')
    .optional()
    .isBoolean().withMessage('Debe ser true o false'),

  validarCampos,

  agregarObraSocial
);
router.put(
  '/:id',
  requiere_permiso({ edit: { obras_sociales: ["*"] } }),

  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('Debe ser texto'),

  body('descripcion')
    .optional()
    .isString().withMessage('Debe ser texto'),

  body('porcentaje_descuento')
    .optional()
    .isNumeric().withMessage('Debe ser un número'),

  body('es_particular')
    .optional()
    .isBoolean().withMessage('Debe ser true o false'),

  validarCampos,

  actualizarObraSocial
);
router.delete('/:id', requiere_permiso({ delete: { obras_sociales: ["soft"] } }), eliminarObraSocial);

export default router;