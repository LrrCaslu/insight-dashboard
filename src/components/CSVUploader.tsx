import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseXLSX } from "@/utils/xlsxParser";
import { ParsedCSVData } from "@/types/csv";

interface XLSXUploaderProps {
  onDataParsed: (data: ParsedCSVData) => void;
}

export function CSVUploader({ onDataParsed }: XLSXUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError("Por favor, selecione um arquivo Excel válido (.xlsx ou .xls).");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const parsedData = await parseXLSX(file);
      onDataParsed(parsedData);
    } catch (err) {
      setError("Erro ao processar o arquivo Excel. Verifique o formato.");
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, [onDataParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "upload-zone rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
          "bg-card card-shadow hover:card-shadow-lg",
          isDragging && "drag-over"
        )}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
          id="xlsx-upload"
        />
        <label htmlFor="xlsx-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">Processando arquivo...</p>
                  <p className="text-sm text-muted-foreground mt-1">Aguarde um momento</p>
                </div>
              </>
            ) : fileName ? (
              <>
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground mt-1">Arquivo carregado com sucesso</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    Arraste o arquivo Excel aqui
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou clique para selecionar (.xlsx, .xls)
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
