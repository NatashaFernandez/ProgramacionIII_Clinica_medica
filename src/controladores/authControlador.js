import AuthServicio from '../servicios/authServicio.js';

const authServicio = new AuthServicio();

/**
 * Controlador para manejar el inicio de sesión.
 */
export const login = async (req, res) => {

    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
        return res.status(400).json({
            error: "Email y contraseña son requeridos."
        });
    }

    try {

        const resultado = await authServicio.login(
            email,
            contrasenia
        );

        if (!resultado) {
            return res.status(401).json({
                error: "Credenciales inválidas."
            });
        }

        res.status(200).json(resultado);

    } catch (error) {

        res.status(500).json({
            error: "Error en el servidor",
            message: error.message
        });

    }

};