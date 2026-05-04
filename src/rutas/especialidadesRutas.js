import express from 'express';
import { 
    listarEspecialidades, 
    obtenerEspecialidad, 
    actualizarEspecialidad, 
    agregarEspecialidad, 
    eliminarEspecialidad 
} from '../controladores/especialidadesControlador.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';

const router = express.Router();

router.get('/', requiere_permiso({ browse: { especialidades: ["*"] } }), listarEspecialidades);
router.get('/:id', requiere_permiso({ read: { especialidades: ["*"] } }), obtenerEspecialidad);
router.post('/', requiere_permiso({ add: { especialidades: ["*"] } }), agregarEspecialidad);
router.put('/:id', requiere_permiso({ edit: { especialidades: ["*"] } }), actualizarEspecialidad);
router.delete('/:id', requiere_permiso({ delete: { especialidades: ["soft"] } }), eliminarEspecialidad);

export default router;