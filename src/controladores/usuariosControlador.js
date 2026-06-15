
import db from '../configuracion/db.js';

export const usuariosControlador = {
    // 1. BROWSE: Listar usuarios activos
    listar: async (req, res) => {
        try {
            const [usuarios] = await db.query(
                'SELECT id_usuario, documento, apellido, nombres, email, rol FROM usuarios WHERE activo = 1'
            );
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los usuarios: " + error.message });
        }
    },

    // 2. READ: Obtener un usuario por ID
    obtenerPorId: async (req, res) => {
        const { id } = req.params;
        try {
            const [usuarios] = await db.query(
                'SELECT id_usuario, documento, apellido, nombres, email, rol FROM usuarios WHERE id_usuario = ? AND activo = 1',
                [id]
            );

            if (usuarios.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json(usuarios[0]);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario: " + error.message });
        }
    },

    // 3. ADD: Registrar Usuario (Con Transacciones para Pacientes)
    registrar: async (req, res) => {
        const { documento, apellido, nombres, email, contrasenia, rol, id_obra_social } = req.body;

        // Pedimos una conexión dedicada para la transacción
        const conexion = await db.getConnection();

        try {
            await conexion.beginTransaction(); // Inicio de la transacción

            // 1. Insertar en la tabla global de usuarios
            const [resultadoUsuario] = await conexion.query(
                `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) 
                 VALUES (?, ?, ?, ?, SHA2(?, 256), '', ?, 1)`,
                [documento, apellido, nombres, email, contrasenia, rol]
            );

            const nuevoIdUsuario = resultadoUsuario.insertId;

            // 2. Si el rol es Paciente (ROL = 2), lo asociamos con su obra social obligatoriamente
            if (Number(rol) === 2) {
                if (!id_obra_social) {
                    throw new Error("El campo id_obra_social es obligatorio para el rol Paciente.");
                }

                await conexion.query(
                    'INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)',
                    [nuevoIdUsuario, id_obra_social]
                );
            }

            await conexion.commit(); // Todo salió bien, guardamos los cambios de forma definitiva

            res.status(201).json({
                mensaje: "Usuario registrado con éxito",
                id_usuario: nuevoIdUsuario
            });

        } catch (error) {
            await conexion.rollback(); // Si algo falló, deshacemos todo para evitar datos huérfanos

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "El documento o email ya se encuentran registrados." });
            }
            res.status(500).json({ error: "Error al registrar el usuario: " + error.message });
        } finally {
            conexion.release(); // Liberamos la conexión de vuelta al pool
        }
    },

    // 4. EDIT: Modificar datos de un usuario
    actualizar: async (req, res) => {
        const { id } = req.params;
        const { documento, apellido, nombres, email } = req.body;

        try {
            const [resultado] = await db.query(
                `UPDATE usuarios 
                 SET documento = ?, apellido = ?, nombres = ?, email = ? 
                 WHERE id_usuario = ? AND activo = 1`,
                [documento, apellido, nombres, email, id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Usuario no encontrado o inactivo" });
            }

            res.json({ mensaje: "Usuario actualizado con éxito" });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "El documento o email ya están en uso por otro usuario." });
            }
            res.status(500).json({ error: "Error al actualizar el usuario: " + error.message });
        }
    },

    // 5. DELETE: Soft Delete (Baja lógica)
    eliminar: async (req, res) => {
        const { id } = req.params;

        try {
            
            const [resultado] = await db.query(
                'UPDATE usuarios SET activo = 0 WHERE id_usuario = ?',
                [id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ mensaje: "Usuario dado de baja con éxito (Soft Delete)" });
        } catch (error) {
            res.status(500).json({ error: "Error al dar de baja el usuario: " + error.message });
        }
    }
};