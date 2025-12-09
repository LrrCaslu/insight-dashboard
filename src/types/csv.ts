export interface CSVRow {
  [key: string]: string;
}

export interface ParsedCSVData {
  headers: string[];
  rows: CSVRow[];
  roleColumn: string;
  schoolColumn: string;
  questionColumns: string[];
}

export interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

export interface BarChartData {
  question: string;
  [key: string]: string | number;
}
