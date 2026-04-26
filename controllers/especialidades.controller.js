import { pool } from "../db/conexion.js";

// GET 
export const getEspecialidades = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE activo = 1"
    );
    res.json({ estado: "ok", data: rows });
  } catch (error) {
    res.status(500).json({ error: "Error servidor" });
  }
};

// GET 
export const getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json({ estado: "ok", data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error servidor" });
  }
};

// CREATE
export const createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "Falta nombre" });
    }

    await pool.execute(
      "INSERT INTO especialidades (nombre) VALUES (?)",
      [nombre]
    );

    res.status(201).json({ estado: "ok", msg: "Creado" });
  } catch (error) {
    res.status(500).json({ error: "Error servidor" });
  }
};

// UPDATE
export const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "Falta nombre" });
    }

    await pool.execute(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?",
      [nombre, id]
    );

    res.json({ estado: "ok", msg: "Actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error servidor" });
  }
};

// DELETE
export const deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?",
      [id]
    );

    res.json({ estado: "ok", msg: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error servidor" });
  }
};
