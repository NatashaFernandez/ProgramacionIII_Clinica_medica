import express from 'express';
import { 
    listarObrasSociales, 
    obtenerObraSocial, 
    agregarObraSocial, 
    actualizarObraSocial, 
    eliminarObraSocial 
} from '../controladores/obrasSocialesControlador.js';
import { requiere_permiso } from '../middlewares/requiere_permiso.js';

const router = express.Router();

router.get('/', requiere_permiso({ browse: { obras_sociales: ["*"] } }), listarObrasSociales);
router.get('/:id', requiere_permiso({ read: { obras_sociales: ["*"] } }), obtenerObraSocial);
router.post('/', requiere_permiso({ add: { obras_sociales: ["*"] } }), agregarObraSocial);
router.put('/:id', requiere_permiso({ edit: { obras_sociales: ["*"] } }), actualizarObraSocial);
router.delete('/:id', requiere_permiso({ delete: { obras_sociales: ["soft"] } }), eliminarObraSocial);

export default router;