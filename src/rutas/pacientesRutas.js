import express from 'express';
import {
    listarPacientes,
    obtenerPaciente,
    agregarPaciente,
    actualizarPaciente,
    eliminarPaciente
} from '../controladores/pacientesControlador.js';

import { requiere_permiso } from '../middlewares/requiere_permiso.js';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validar_campos.js';

const router = express.Router();

/* LISTAR PACIENTES */
router.get(
    '/',
    /**
     * @swagger
     * /api/v1/pacientes:
     *   get:
     *     summary: Listar pacientes
     *     tags:
     *       - Pacientes
     *     responses:
     *       200:
     *         description: Lista de pacientes
     */
    requiere_permiso({ browse: { pacientes: ["*"] } }),
    listarPacientes
);

/* OBTENER PACIENTE */
router.get(
    '/:id',
    /**
     * @swagger
     * /api/v1/pacientes/{id}:
     *   get:
     *     summary: Obtener paciente por ID
     *     tags:
     *       - Pacientes
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Paciente encontrado
     *       404:
     *         description: No encontrado
     */
    requiere_permiso({ read: { pacientes: ["*"] } }),
    obtenerPaciente
);

/* CREAR PACIENTE */
router.post(
    '/',
    /**
     * @swagger
     * /api/v1/pacientes:
     *   post:
     *     summary: Crear paciente
     *     tags:
     *       - Pacientes
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - documento
     *               - apellido
     *               - nombres
     *               - email
     *               - contrasenia
     *             properties:
     *               documento:
     *                 type: string
     *               apellido:
     *                 type: string
     *               nombres:
     *                 type: string
     *               email:
     *                 type: string
     *               contrasenia:
     *                 type: string
     *               foto_path:
     *                 type: string
     *               id_obra_social:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Paciente creado
     */
    requiere_permiso({ add: { pacientes: ["*"] } }),

    body('documento').notEmpty().isString(),
    body('apellido').notEmpty().isString(),
    body('nombres').notEmpty().isString(),
    body('email').notEmpty().isEmail(),
    body('contrasenia').notEmpty().isLength({ min: 6 }),
    body('id_obra_social').optional().isInt(),

    validarCampos,

    agregarPaciente
);

/*  ACTUALIZAR PACIENTE */
router.put(
    '/:id',
    /**
     * @swagger
     * /api/v1/pacientes/{id}:
     *   put:
     *     summary: Actualizar paciente
     *     tags:
     *       - Pacientes
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               documento:
     *                 type: string
     *               apellido:
     *                 type: string
     *               nombres:
     *                 type: string
     *               email:
     *                 type: string
     *               foto_path:
     *                 type: string
     *               id_obra_social:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Paciente actualizado
     */
    requiere_permiso({ edit: { pacientes: ["*"] } }),

    body('documento').optional().isString(),
    body('apellido').optional().isString(),
    body('nombres').optional().isString(),
    body('email').optional().isEmail(),
    body('foto_path').optional().isString(),
    body('id_obra_social').optional().isInt(),

    validarCampos,

    actualizarPaciente
);

/*  ELIMINAR PACIENTE */
router.delete(
    '/:id',
    /**
     * @swagger
     * /api/v1/pacientes/{id}:
     *   delete:
     *     summary: Desactivar paciente
     *     tags:
     *       - Pacientes
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Paciente desactivado
     */
    requiere_permiso({ delete: { pacientes: ["soft"] } }),
    eliminarPaciente
);

export default router;