import { CSVRow, ParsedCSVData } from "@/types/csv";

export function parseCSV(csvText: string): ParsedCSVData {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error("Arquivo CSV vazio");
  }

  const headers = parseCSVLine(lines[0]);
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
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
    h !== roleColumn && h !== schoolColumn
  );

  return {
    headers,
    rows,
    roleColumn,
    schoolColumn,
    questionColumns
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
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
