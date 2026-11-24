import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { Proveedor } from '../types/proveedor';

export function exportarProveedoresExcel(proveedores: Proveedor[]) {
  const filas = proveedores.map((p) => ({
    ID: p.id,
    Nombre: p.nombre,
    Contacto: p.contacto || '-',
    Teléfono: p.telefono || '-',
    Email: p.email || '-',
    Dirección: p.direccion || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(filas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');
  XLSX.writeFile(workbook, `proveedores_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportarProveedoresPDF(proveedores: Proveedor[]) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('FerreGest - Listado de Proveedores', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleString('es-AR')} · Total registros: ${proveedores.length}`, 14, 25);

  let y = 36;
  doc.setFontSize(9);
  doc.setTextColor(20, 54, 43);
  doc.text('ID | Nombre | Contacto | Teléfono | Email', 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 8;
  doc.setTextColor(30);

  proveedores.forEach((p) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    const nombre = (p.nombre || '').slice(0, 22);
    const contacto = (p.contacto || '-').slice(0, 18);
    const telefono = (p.telefono || '-').slice(0, 16);
    const email = (p.email || '-').slice(0, 26);
    const linea = `#${p.id} | ${nombre} | ${contacto} | ${telefono} | ${email}`;
    doc.text(linea, 14, y);
    y += 7;
  });

  doc.save(`proveedores_${new Date().toISOString().slice(0, 10)}.pdf`);
}