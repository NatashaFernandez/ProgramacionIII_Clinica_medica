import db from '../configuracion/db.js';

export default class Estadisticas {

    obtenerEstadisticasAtenciones = async () => {
        const [resultados] = await db.query('CALL sp_obtener_estadisticas()');
        
        return {
            generales: resultados[0][0] || null,
            porEspecialidad: resultados[1] || []
        };
    };
}