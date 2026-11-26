import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { Categoria } from '../types/categoria';

export function exportarCategoriasExcel(categorias: Categoria[]) {
  const filas = categorias.map((c) => ({
    ID: c.id,
    Nombre: c.nombre,
    Descripcion: c.descripcion || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(filas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Categorias');
  XLSX.writeFile(workbook, `categorias_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportarCategoriasPDF(categorias: Categoria[]) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('FerreGest - Reporte de Categorías', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleString('es-AR')} · Total registros: ${categorias.length}`, 14, 25);

  let y = 36;
  doc.setFontSize(9);
  doc.setTextColor(20, 54, 43);
  doc.text('ID | Nombre | Descripción', 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 8;
  doc.setTextColor(30);

  categorias.forEach((c) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    const desc = (c.descripcion || '-').slice(0, 55);
    doc.text(`#${c.id} | ${c.nombre} | ${desc}`, 14, y);
    y += 7;
  });

  doc.save(`categorias_${new Date().toISOString().slice(0, 10)}.pdf`);
}