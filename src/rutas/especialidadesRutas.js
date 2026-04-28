import express from 'express';
import { 
    listarEspecialidades, 
    obtenerEspecialidad, 
    actualizarEspecialidad, 
    agregarEspecialidad, 
    eliminarEspecialidad 
} from '../controladores/especialidadesControlador.js';

const router = express.Router();

router.get('/', listarEspecialidades);          // Browse
router.get('/:id', obtenerEspecialidad);        // Read
router.post('/', agregarEspecialidad);          // Add
router.put('/:id', actualizarEspecialidad);     // Edit
router.delete('/:id', eliminarEspecialidad);    // Delete

export default router;