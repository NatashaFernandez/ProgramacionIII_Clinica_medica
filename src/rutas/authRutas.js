import express from 'express';
import { body } from 'express-validator';
import { login } from '../controladores/authControlador.js';
import { validarCampos } from '../middlewares/validar_campos.js';

const router = express.Router();

router.post('/login',
    // VALIDACIONES
    body('email')
        .isEmail().withMessage('Debe ser un email válido'),

    body('contrasenia')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    validarCampos,

    login
);

export default router;