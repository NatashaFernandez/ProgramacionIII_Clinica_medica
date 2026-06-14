import { Router } from 'express';
import { body } from 'express-validator';
import { usuariosControlador } from '../controladores/usuariosControlador.js';
import { validarCampos } from '../middlewares/validar_campos.js';
import { requiere_session } from '../middlewares/requiere_session.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Listar usuarios activos
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Registrar usuario
 *     tags:
 *       - Usuarios
 *     responses:
 *       201:
 *         description: Usuario creado
 */

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   delete:
 *     summary: Baja lógica de usuario
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */

const router = Router();

// 1. Listar Usuarios (Browse)
router.get('/', requiere_session, requiere_permiso, usuariosControlador.listar);

// 2. Obtener un Usuario por ID (Read)
router.get('/:id', requiere_session, requiere_permiso, usuariosControlador.obtenerPorId);

// 3. Registrar un Usuario (Add)
router.post('/', 
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

// 4. Actualizar un Usuario (Edit)
router.put('/:id', 
    [
        requiere_session,
        requiere_permiso,
        body('documento', 'El documento debe tener entre 7 y 20 caracteres').isLength({ min: 7, max: 20 }),
        body('apellido', 'El apellido es obligatorio').notEmpty().trim(),
        body('nombres', 'El nombre es obligatorio').notEmpty().trim(),
        body('email', 'Introduce un email válido').isEmail().normalizeEmail(),
        validarCampos
    ], 
    usuariosControlador.actualizar
);

// 5. Eliminar un Usuario (Delete -> Soft Delete)
router.delete('/:id', requiere_session, requiere_permiso, usuariosControlador.eliminar);

export default router;