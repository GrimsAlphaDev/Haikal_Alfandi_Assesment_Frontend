import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  exportToExcel(data: any[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Banners');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  exportToPDF(data: any[], filename: string) {
    // Pastikan data tidak kosong
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    try {
      const doc = new jsPDF();

      // Judul Dokumen
      doc.setFontSize(16);
      doc.text(`${filename} Report`, 10, 10);

      // Ambil header dari data pertama
      const headers = data.length > 0 ? Object.keys(data[0]) : [];

      // Konversi data ke format array
      const body = data.map((item) =>
        headers.map((header) => item[header] || '')
      );

      // Tambahkan tabel
      autoTable(doc, {
        startY: 20,
        head: [headers],
        body: body,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
        },
      });

      // Simpan PDF
      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('PDF Export Error', error);
    }
  }
}
