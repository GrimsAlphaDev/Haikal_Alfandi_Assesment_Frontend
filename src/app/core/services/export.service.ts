import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  exportToExcel(data: any[], columns: string[], filename: string) {
    // Validasi data
    if (!data || data.length === 0) {
      console.warn('Tidak ada data untuk diekspor');
      return;
    }

    try {
      // Transformasi data
      const exportData = data.map((item) => {
        const exportItem: any = {};
        columns.forEach((col) => {
          // Ambil nilai dengan fallback ke '-'
          exportItem[this.formatColumnName(col)] =
            this.getNestedValue(item, col) || '-';
        });
        return exportItem;
      });

      // Buat worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      // Buat workbook
      const workbook: XLSX.WorkBook = {
        Sheets: { Data: worksheet },
        SheetNames: ['Data'],
      };

      // Generate nama file
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}_${timestamp}.xlsx`;

      // Simpan file
      XLSX.writeFile(workbook, exportFilename);
    } catch (error) {
      console.error('Gagal mengekspor Excel', error);
    }
  }

  // Utility untuk mengakses nested property
  private getNestedValue(obj: any, path: string): any {
    return path.split('.')
      .reduce((o, key) => (o && o[key] !== 'undefined') ? o[key] : '', obj);
  }

  // Format nama kolom menjadi lebih readable
  private formatColumnName(column: string): string {
    return column
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  exportToPDF(data: any[], columns: string[], title: string) {
    // Pastikan data tidak kosong
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    try {
      const doc = new jsPDF();

      // Judul Dokumen
      doc.setFontSize(16);
      doc.text(`${title} Report`, 10, 10);

      // Siapkan data untuk tabel
      const tableData = data.map((item) =>
        columns.map((col) => this.getNestedValue(item, col) || '-')
      );

      (doc as any).autoTable({
        startY: 20,
        head: [columns],
        body: tableData,
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
        },
        didDrawPage: (data: any) => {
          // Tambahkan nomor halaman
          const pageCount = (doc as any).internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            (doc as any).setPage(i);
            (doc as any).text(
              `Halaman ${i} dari ${pageCount}`,
              data.settings.margin.left,
              (doc as any).internal.pageSize.height - 10
            );
          }
        },
      });
      // Simpan PDF
      doc.save(`${title}_${new Date().toISOString()}.pdf`);
    } catch (error) {
      console.error('PDF Export Error', error);
    }
  }
}
