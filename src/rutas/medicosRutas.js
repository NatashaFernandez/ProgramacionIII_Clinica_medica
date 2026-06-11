import express from 'express';
import { body, param } from 'express-validator';
import MedicosControlador from '../controladores/medicosControlador.js';
import { validarCampos } from '../middlewares/validar_campos.js';
import { requiere_session } from '../middlewares/requiere_session.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';

const router = express.Router();

const medicosControlador = new MedicosControlador();

//Listar médicos
 
router.get(
    '/',
    requiere_session,
    requiere_permiso({
        browse: {
            medicos: ['*']
        }
    }),
    medicosControlador.buscarTodos
);

// Listar médicos por especialidad

router.get(
    '/especialidad/:id_especialidad',

    requiere_session,

    requiere_permiso({
        browse: {
            medicos: ['*']
        }
    }),

    param('id_especialidad')
        .isInt()
        .withMessage(
            'El id_especialidad debe ser numérico'
        ),

    validarCampos,

    medicosControlador.buscarPorEspecialidad
);


//Obtener médico por ID

router.get(
    '/:id_medico',
    requiere_session,
    requiere_permiso({
        read: {
            medicos: ['*']
        }
    }),

    param('id_medico')
        .isInt()
        .withMessage('El id_medico debe ser numérico'),

    validarCampos,

    medicosControlador.buscarPorId
);

/*GET /medicos/:id_medico/obras-sociales
 * Obras sociales asociadas
 */

router.get(
    '/:id_medico/obras-sociales',
    requiere_session,
    requiere_permiso({
        read: {
            medicos: ['*']
        }
    }),

    param('id_medico')
        .isInt()
        .withMessage('El id_medico debe ser numérico'),

    validarCampos,

    medicosControlador.buscarObrasSociales
);

/**POST /medicos/:id_medico/obras-sociales
 * Asociar médico con obras sociales
 */

router.post(
    '/:id_medico/obras-sociales',

    requiere_session,

    requiere_permiso({
        add: {
            medicos_obras_sociales: ['*']
        }
    }),

    param('id_medico')
        .isInt()
        .withMessage('El id_medico debe ser numérico'),

    body('obras_sociales')
        .isArray()
        .withMessage('obras_sociales debe ser un array'),

    body('obras_sociales.*.id_obra_social')
        .isInt()
        .withMessage('id_obra_social debe ser numérico'),

    validarCampos,

    medicosControlador.asociarObrasSociales
);

/* PUT /medicos/:id_medico/especialidad
 * Cambiar especialidad de un médico
 */

router.put(
    '/:id_medico/especialidad',

    requiere_session,

    requiere_permiso({
        edit: {
            medicos: ['id_especialidad']
        }
    }),

    param('id_medico')
        .isInt()
        .withMessage('El id_medico debe ser numérico'),

    body('id_especialidad')
        .isInt()
        .withMessage('id_especialidad debe ser numérico'),

    validarCampos,

    medicosControlador.actualizarEspecialidad
);

export default router;
