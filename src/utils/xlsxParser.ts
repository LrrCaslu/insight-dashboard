import * as XLSX from "xlsx";
import { CSVRow, ParsedCSVData } from "@/types/csv";

export function parseXLSX(file: File): Promise<ParsedCSVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { 
          header: 1,
          defval: ""
        });
        
        if (jsonData.length === 0) {
          throw new Error("Arquivo XLSX vazio");
        }

        const headers = (jsonData[0] as string[]).map(h => String(h).trim());
        const rows: CSVRow[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const rowData = jsonData[i] as string[];
          if (rowData.some(cell => cell !== "")) {
            const row: CSVRow = {};
            headers.forEach((header, index) => {
              row[header] = String(rowData[index] || "").trim();
            });
            rows.push(row);
          }
        }

        const roleColumn = headers.find(h => 
          h.toLowerCase().includes("você atua como") || 
          h.toLowerCase().includes("atua como")
        ) || headers[0];

        const schoolColumn = headers.find(h => 
          h.toLowerCase().includes("unidade escolar") || 
          h.toLowerCase().includes("escola")
        ) || headers[1];

        const questionColumns = headers.filter(h => 
          h !== roleColumn && 
          h !== schoolColumn &&
          !h.toLowerCase().includes("carimbo") &&
          !h.toLowerCase().includes("data/hora") &&
          !h.toLowerCase().includes("timestamp")
        );

        resolve({
          headers,
          rows,
          roleColumn,
          schoolColumn,
          questionColumns
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function countValues(data: CSVRow[], column: string): Record<string, number> {
  const counts: Record<string, number> = {};
  
  data.forEach(row => {
    const value = row[column]?.trim() || "Não informado";
    counts[value] = (counts[value] || 0) + 1;
  });

  return counts;
}

export function getUniqueValues(data: CSVRow[], column: string): string[] {
  const unique = new Set<string>();
  data.forEach(row => {
    const value = row[column]?.trim();
    if (value) unique.add(value);
  });
  return Array.from(unique).sort();
}
