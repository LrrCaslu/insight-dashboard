import { useState } from "react";
import { CSVUploader } from "@/components/CSVUploader";
import { Dashboard } from "@/components/Dashboard";
import { ParsedCSVData } from "@/types/csv";
import { BarChart3, Upload } from "lucide-react";

const Index = () => {
  const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null);

  const handleReset = () => {
    setParsedData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Avaliação Institucional</h1>
              <p className="text-xs text-muted-foreground">Projeto Piloto</p>
            </div>
          </div>
          {parsedData && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Novo Upload
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {parsedData ? (
          <Dashboard data={parsedData} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Painel de Avaliação Institucional
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Faça upload do arquivo Excel (.xlsx) com os dados da pesquisa para visualizar os resultados de forma interativa.
              </p>
            </div>
            <CSVUploader onDataParsed={setParsedData} />
            
            <div className="mt-12 p-6 bg-card rounded-xl card-shadow max-w-lg">
              <h3 className="font-medium text-foreground mb-3">Formato esperado do arquivo Excel:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span><strong>Coluna 1:</strong> Você atua como (função)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span><strong>Coluna 2:</strong> Unidade Escolar onde atua</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span><strong>Colunas 3-45:</strong> Respostas das questões</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
