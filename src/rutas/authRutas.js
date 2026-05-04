import express from 'express';
import { login } from '../controladores/authControlador.js';

const router = express.Router();

// Endpoint para obtener el token: POST /auth/login
router.post('/login', login);

export default router;