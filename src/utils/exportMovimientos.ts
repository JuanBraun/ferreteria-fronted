import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { Movimiento } from '../types/movimiento';

export function exportarMovimientosExcel(movimientos: Movimiento[]) {
  const filas = movimientos.map((m) => ({
    ID: m.id,
    Fecha: new Date(m.fecha).toLocaleDateString('es-AR'),
    Tipo: m.tipo,
    Producto: m.productoNombre || `Producto #${m.productoId}`,
    Cantidad: m.cantidad,
    Motivo: m.motivo,
    Responsable: m.usuarioNombre || (m.usuarioId ? `Usuario #${m.usuarioId}` : '-'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(filas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');
  XLSX.writeFile(workbook, `movimientos_stock_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportarMovimientosPDF(movimientos: Movimiento[]) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('FerreGest - Reporte de Movimientos de Stock', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleString('es-AR')} · Total registros: ${movimientos.length}`, 14, 25);

  let y = 36;
  doc.setFontSize(9);
  doc.setTextColor(20, 54, 43);
  doc.text('ID | Fecha | Tipo | Producto | Cant. | Motivo', 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 8;
  doc.setTextColor(30);

  movimientos.forEach((m) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    const fecha = new Date(m.fecha).toLocaleDateString('es-AR');
    const prod = (m.productoNombre || `Prod #${m.productoId}`).slice(0, 22);
    const motivo = (m.motivo || '').slice(0, 28);
    const linea = `#${m.id} | ${fecha} | ${m.tipo} | ${prod} | ${m.cantidad} | ${motivo}`;
    doc.text(linea, 14, y);
    y += 7;
  });

  doc.save(`movimientos_stock_${new Date().toISOString().slice(0, 10)}.pdf`);
}