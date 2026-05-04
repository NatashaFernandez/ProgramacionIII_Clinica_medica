import db from '../configuracion/db.js';
import jwt from 'jsonwebtoken';

/**
 * Controlador para manejar el inicio de sesión y generación de JWT.
 */
export const login = async (req, res) => {
    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
        return res.status(400).json({ error: "Email y contraseña son requeridos." });
    }

    try {
        // Se compara la contraseña directamente en la query usando SHA2-256 de MySQL
        const [resultado] = await db.query(
            'SELECT id_usuario, email, rol FROM usuarios WHERE email = ? AND contrasenia = SHA2(?, 256) AND activo = 1',
            [email, contrasenia]
        );

        // Si no hay resultados, significa que el email no existe o la contraseña es incorrecta
        // Mostramos un mensaje no tan especifico para más seguridad
        if (resultado.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        const [usuario] = resultado;

        const token = jwt.sign(
            { 
                id: usuario.id_usuario, 
                email: usuario.email,
                rol: usuario.rol 
            }, 
            process.env.CLAVE_JWT || 'clave_secreta_por_defecto',
            { expiresIn: '4h' }
        );

        res.status(200).json({
            id: usuario.id_usuario,
            nombres: usuario.nombres,
            apellido: usuario.apellido,
            foto_path: usuario.foto_path,
            documento: usuario.documento,
            email: usuario.email,
            rol: usuario.rol,
            token: token,
            expiresIn: +new Date(Date.now() + 4 * 60 * 60 * 1000)
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", message: error.message });
    }
};