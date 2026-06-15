import { Router } from 'express';
import { body } from 'express-validator';
import { usuariosControlador } from '../controladores/usuariosControlador.js';
import { requiere_session } from '../middlewares/requiere_session.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { validarCampos } from '../middlewares/validar_campos.js';
import { upload } from '../middlewares/multer.js'; // Importación de tu Multer

const router = Router();

/**
 * @swagger
 * /api/v1/usuarios:
 * get:
 * summary: Listar usuarios activos
 * tags: [- Usuarios]
 * security:
 * - bearerAuth: []
 */
router.get('/', 
    requiere_session, 
    requiere_permiso({ browse: { usuarios: ["*"] } }), 
    usuariosControlador.listar
);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 * get:
 * summary: Obtener un usuario por ID
 * tags: [- Usuarios]
 * security:
 * - bearerAuth: []
 */
router.get('/:id', 
    requiere_session, 
    requiere_permiso({ read: { usuarios: ["*"] } }), 
    usuariosControlador.obtenerPorId
);

/**
 * @swagger
 * /api/v1/usuarios:
 * post:
 * summary: Registrar un nuevo usuario (Soporta carga de foto)
 * tags: [- Usuarios]
 * description: Envía los datos como multipart/form-data para adjuntar una imagen en el campo 'foto'.
 */
router.post('/',
    upload.single('foto'), 
    [
        
        body('documento', 'El documento debe tener entre 7 y 20 caracteres').isLength({ min: 7, max: 20 }),
        body('apellido', 'El apellido es obligatorio').notEmpty().trim(),
        body('nombres', 'El nombre es obligatorio').notEmpty().trim(),
        body('email', 'Introduce un email válido').isEmail().normalizeEmail(),
        body('contrasenia', 'La contraseña debe tener al menos 3 caracteres').isLength({ min: 3 }),
        body('rol', 'El rol es obligatorio y debe ser un número entero').isInt(),
        validarCampos 
    ], 
    usuariosControlador.registrar 
);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 * put:
 * summary: Actualizar datos de un usuario (Soporta actualización de foto)
 * tags: [- Usuarios]
 * security:
 * - bearerAuth: []
 */
router.put('/:id', 
    requiere_session,
    requiere_permiso({ edit: { usuarios: ["*"] } }),
    upload.single('foto'), 
    [
        body('documento', 'El documento debe tener entre 7 y 20 caracteres').isLength({ min: 7, max: 20 }),
        body('apellido', 'El apellido es obligatorio').notEmpty().trim(),
        body('nombres', 'El nombre es obligatorio').notEmpty().trim(),
        body('email', 'Introduce un email válido').isEmail().normalizeEmail(),
        validarCampos
    ], 
    usuariosControlador.actualizar
);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 * delete:
 * summary: Baja lógica de usuario (Soft Delete)
 * tags: [- Usuarios]
 * security:
 * - bearerAuth: []
 */
router.delete('/:id', 
    requiere_session, 
    requiere_permiso({ delete: { usuarios: ["soft"] } }), 
    usuariosControlador.eliminar
);

export default router;