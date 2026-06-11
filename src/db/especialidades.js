import db from '../configuracion/db.js';

export default class Especialidades {

    buscarTodas = async () => {

        const [results] = await db.query(
            'SELECT * FROM especialidades WHERE activo = 1'
        );

        return results;
    };

    buscarPorId = async (id) => {

        const [results] = await db.query(
            'SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1',
            [id]
        );

        return results[0];
    };

    agregar = async (nombre) => {

        const [resultado] = await db.query(
            'INSERT INTO especialidades (nombre) VALUES (?)',
            [nombre]
        );

        return resultado.insertId;
    };

    actualizar = async (id, nombre) => {

        await db.query(
            'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?',
            [nombre, id]
        );

        return await this.buscarPorId(id);
    };

    eliminar = async (id) => {

        await db.query(
            'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?',
            [id]
        );

        return true;
    };

}