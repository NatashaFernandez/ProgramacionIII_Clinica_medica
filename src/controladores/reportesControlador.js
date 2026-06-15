import Estadisticas from '../db/estadisticas.js';
import ReportesServicio from '../servicios/reportesServicio.js';

const estadisticasDB = new Estadisticas();
const reportesServicio = new ReportesServicio();

export const obtenerEstadisticas = async (req, res) => {
    try {
        const datos = await estadisticasDB.obtenerEstadisticasAtenciones();
        return res.status(200).json({
            estado: true,
            mensaje: "Estadísticas procesadas desde Stored Procedure con éxito.",
            datos
        });
    } catch (error) {
        return res.status(500).json({ error: "Error en base de datos: " + error.message });
    }
};

export const descargarInformePDF = async (req, res) => {
    try {
        const pdfBuffer = await reportesServicio.generarReporteTurnosPDF();
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=reporte-clinica-turnos.pdf',
            'Content-Length': pdfBuffer.length
        });

        return res.end(pdfBuffer);
    } catch (error) {
        return res.status(500).json({ error: "Error al compilar el reporte PDF: " + error.message });
    }
};