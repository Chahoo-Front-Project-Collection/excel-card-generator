import * as XLSX from 'xlsx';
import type { ParsedExcel } from '../types';

export function parseExcel(file: File): Promise<ParsedExcel> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rawRows: string[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: '',
        });

        if (rawRows.length < 2) {
          resolve({ headers: [], rows: [] });
          return;
        }

        const headers = rawRows[0].map(String);
        const rows = rawRows.slice(1).map((row) => {
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = String(row[i] ?? '');
          });
          return obj;
        });

        resolve({ headers, rows });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
