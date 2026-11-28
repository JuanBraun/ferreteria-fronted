import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { Producto } from '../types/producto';

export function exportarProductosExcel(productos: Producto[]) {
  const filas = productos.map((p) => ({
    ID: p.id,
    Codigo: p.codigo,
    Nombre: p.nombre,
    Categoria: p.categoria,
    Precio: p.precio,
    'Stock Actual': p.stockActual,
    'Stock Minimo': p.stockMinimo,
    Estado: p.stockActual <= p.stockMinimo ? 'BAJO STOCK' : 'OK',
  }));

  const worksheet = XLSX.utils.json_to_sheet(filas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
  XLSX.writeFile(workbook, `productos_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportarProductosPDF(productos: Producto[]) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('FerreGest - Catálogo de Productos', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleString('es-AR')} · Total registros: ${productos.length}`, 14, 25);

  let y = 36;
  doc.setFontSize(9);
  doc.setTextColor(20, 54, 43);
  doc.text('Código | Nombre | Categoría | Precio | Stock | Estado', 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 8;
  doc.setTextColor(30);

  productos.forEach((p) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    const nombre = p.nombre.slice(0, 24);
    const cat = p.categoria.slice(0, 18);
    const estado = p.stockActual <= p.stockMinimo ? 'BAJO STOCK' : 'OK';
    const linea = `${p.codigo} | ${nombre} | ${cat} | $${p.precio} | ${p.stockActual}/${p.stockMinimo} | ${estado}`;
    doc.text(linea, 14, y);
    y += 7;
  });

  doc.save(`productos_${new Date().toISOString().slice(0, 10)}.pdf`);
}