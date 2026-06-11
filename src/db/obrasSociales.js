import db from '../configuracion/db.js';

export default class ObrasSociales {

    listar = async () => {

        const [results] = await db.query(
            'SELECT * FROM obras_sociales WHERE activo = 1'
        );

        return results;
    };

    obtenerPorId = async (id) => {

        const [results] = await db.query(
            'SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
            [id]
        );

        return results[0];
    };

    agregar = async (
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular
    ) => {

        const [resultado] = await db.query(
            `INSERT INTO obras_sociales
            (
                nombre,
                descripcion,
                porcentaje_descuento,
                es_particular
            )
            VALUES (?, ?, ?, ?)`,
            [
                nombre,
                descripcion,
                porcentaje_descuento,
                es_particular
            ]
        );

        return resultado.insertId;
    };

    actualizar = async (
        id,
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular
    ) => {

        await db.query(
            `UPDATE obras_sociales
             SET nombre = ?,
                 descripcion = ?,
                 porcentaje_descuento = ?,
                 es_particular = ?
             WHERE id_obra_social = ?`,
            [
                nombre,
                descripcion,
                porcentaje_descuento,
                es_particular,
                id
            ]
        );

        return await this.obtenerPorId(id);
    };

    eliminar = async (id) => {

        await db.query(
            'UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?',
            [id]
        );

        return true;
    };

}