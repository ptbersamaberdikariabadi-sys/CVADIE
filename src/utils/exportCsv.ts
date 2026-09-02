/**
 * Utilitas untuk mengunduh data dalam format CSV
 * @param filename Nama file saat diunduh (termasuk .csv)
 * @param columns Daftar nama kolom (header)
 * @param data Array yang berisi array of string/number sesuai urutan kolom
 */
export function downloadCSV(filename: string, columns: string[], data: (string | number)[][]) {
  // Membuat header row
  const header = columns.join(',');
  
  // Mengubah data menjadi baris-baris CSV, escape jika ada koma dalam string
  const rows = data.map(row => 
    row.map(cell => {
      const cellString = String(cell);
      // Jika cell mengandung koma, baris baru, atau kutip ganda, bungkus dengan kutip ganda
      if (cellString.includes(',') || cellString.includes('\n') || cellString.includes('"')) {
        return `"${cellString.replace(/"/g, '""')}"`;
      }
      return cellString;
    }).join(',')
  );

  // Menggabungkan header dan baris
  const csvContent = [header, ...rows].join('\n');
  
  // Menambahkan BOM untuk dukungan UTF-8 di Excel
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Membuat elemen anchor untuk memicu download
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
