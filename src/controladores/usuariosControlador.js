import db from '../configuracion/db.js';

export const usuariosControlador = {
    

    listar: async (req, res) => {
        try {
            const [usuarios] = await db.query(
                'SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol FROM usuarios WHERE activo = 1'
            );
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los usuarios: " + error.message });
        }
    },

    obtenerPorId: async (req, res) => {
        const { id } = req.params;
        try {
            const [usuarios] = await db.query(
                'SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol FROM usuarios WHERE id_usuario = ? AND activo = 1',
                [id]
            );

            if (usuarios.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado o inactivo" });
            }

            res.json(usuarios[0]);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario: " + error.message });
        }
    },

    registrar: async (req, res) => {
        const { documento, apellido, nombres, email, contrasenia, rol, id_obra_social } = req.body;

        const fotoPath = req.file ? `uploads/${req.file.filename}` : null;

        const conexion = await db.getConnection();

        try {
            await conexion.beginTransaction();

            const [resultadoUsuario] = await conexion.query(
                `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) 
                 VALUES (?, ?, ?, ?, SHA2(?, 256), ?, ?, 1)`,
                [documento, apellido, nombres, email, contrasenia, fotoPath, rol]
            );

            const nuevoIdUsuario = resultadoUsuario.insertId;

            if (Number(rol) === 2) {
                if (!id_obra_social) {
                    throw new Error("El campo id_obra_social es obligatorio para el rol Paciente.");
                }

                await conexion.query(
                    'INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)',
                    [nuevoIdUsuario, id_obra_social]
                );
            }

            await conexion.commit();

            res.status(201).json({
                mensaje: "Usuario registrado con éxito",
                id_usuario: nuevoIdUsuario,
                foto_path: fotoPath 
            });

        } catch (error) {
            await conexion.rollback(); 
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "El documento o email ya se encuentran registrados." });
            }
            res.status(500).json({ error: "Error al registrar el usuario: " + error.message });
        } finally {
            conexion.release();
        }
    },

    actualizar: async (req, res) => {
        const { id } = req.params;
        const { documento, apellido, nombres, email } = req.body;
        
        try {
            let resultado;
            
            if (req.file) {
                const nuevaFotoPath = `uploads/${req.file.filename}`;
                
                [resultado] = await db.query(
                    `UPDATE usuarios 
                     SET documento = ?, apellido = ?, nombres = ?, email = ?, foto_path = ? 
                     WHERE id_usuario = ? AND activo = 1`,
                    [documento, apellido, nombres, email, nuevaFotoPath, id]
                );
            } else {
                [resultado] = await db.query(
                    `UPDATE usuarios 
                     SET documento = ?, apellido = ?, nombres = ?, email = ? 
                     WHERE id_usuario = ? AND activo = 1`,
                    [documento, apellido, nombres, email, id]
                );
            }

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