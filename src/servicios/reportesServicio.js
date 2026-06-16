import PDFDocument from 'pdfkit';
import db from '../configuracion/db.js';

export default class ReportesServicio {
    /**
     * 
     * @returns {Promise<Buffer>}
     */
    generarReporteTurnosPDF = async () => {
        const [turnos] = await db.query(`
            SELECT 
                tr.id_turno_reserva,
                tr.fecha_hora,
                tr.valor_total,
                u_p.apellido AS pac_apellido, u_p.nombres AS pac_nombre,
                os.nombre AS obra_social
            FROM turnos_reservas tr
            INNER JOIN pacientes p ON tr.id_paciente = p.id_paciente
            INNER JOIN usuarios u_p ON p.id_usuario = u_p.id_usuario
            LEFT JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.activo = 1
            ORDER BY tr.fecha_hora DESC
        `);

        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        return new Promise((resolve, reject) => {
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // Encabezado del PDF
            doc.fillColor('#2C3E50').fontSize(22).text('CLÍNICA MÉDICA GRUPO AC', { align: 'center' });
            doc.fontSize(10).fillColor('#7F8C8D').text('Informe Gerencial de Turnos Emitidos', { align: 'center' });
            doc.moveDown(2);

            doc.fillColor('#2C3E50').fontSize(12).text(`Cantidad de Registros Auditados: ${turnos.length}`);
            doc.moveDown(1);
            
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#BDC3C7');
            doc.moveDown(1);

            let y = doc.y;
            doc.fontSize(10).fillColor('#34495E');
            doc.text('Fecha y Hora', 50, y, { bold: true });
            doc.text('Paciente', 180, y);
            doc.text('Obra Social / Cobertura', 350, y);
            doc.text('Costo Total', 480, y, { align: 'right' });
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#ECF0F1');
            doc.moveDown(0.5);

            turnos.forEach(turno => {
                if (doc.y > 700) doc.addPage(); // Salto de página automático

                y = doc.y;
                const fecha = new Date(turno.fecha_hora).toLocaleString('es-AR');
                const paciente = `${turno.pac_apellido}, ${turno.pac_nombre}`;
                
                doc.fontSize(9).fillColor('#555555');
                doc.text(fecha, 50, y);
                doc.text(paciente, 180, y, { width: 160, ellipsis: true });
                doc.text(turno.obra_social || 'Particular / Sin Cobertura', 350, y, { width: 120, ellipsis: true });
                doc.text(`$${Number(turno.valor_total).toFixed(2)}`, 480, y, { align: 'right' });
                doc.moveDown(0.5);
            });

            doc.end();
        });
    };
}