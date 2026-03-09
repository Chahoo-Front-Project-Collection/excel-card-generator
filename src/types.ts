export type ExcelRow = Record<string, string>;

export interface ParsedExcel {
  headers: string[];
  rows: ExcelRow[];
}
