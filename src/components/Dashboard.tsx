import { useState, useMemo } from "react";
import { Users, School, ClipboardList, BarChart3 } from "lucide-react";
import { ParsedCSVData, ChartData, CSVRow } from "@/types/csv";
import { countValues, getUniqueValues } from "@/utils/csvParser";
import { StatsCard } from "./StatsCard";
import { PieChartCard } from "./PieChartCard";
import { BarChartCard } from "./BarChartCard";
import { FilterPanel } from "./FilterPanel";

interface DashboardProps {
  data: ParsedCSVData;
}

export function Dashboard({ data }: DashboardProps) {
  const roles = useMemo(() => getUniqueValues(data.rows, data.roleColumn), [data]);
  const schools = useMemo(() => getUniqueValues(data.rows, data.schoolColumn), [data]);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return data.rows.filter(row => {
      const roleMatch = selectedRoles.length === 0 || 
        selectedRoles.includes(row[data.roleColumn]?.trim());
      const schoolMatch = selectedSchools.length === 0 || 
        selectedSchools.includes(row[data.schoolColumn]?.trim());
      return roleMatch && schoolMatch;
    });
  }, [data, selectedRoles, selectedSchools]);

  const roleChartData: ChartData[] = useMemo(() => {
    const counts = countValues(filteredData, data.roleColumn);
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: 0
    }));
  }, [filteredData, data.roleColumn]);

  const schoolChartData: ChartData[] = useMemo(() => {
    const counts = countValues(filteredData, data.schoolColumn);
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: 0
    }));
  }, [filteredData, data.schoolColumn]);

  const questionGroups = useMemo(() => {
    const groups: string[][] = [];
    for (let i = 0; i < data.questionColumns.length; i += 10) {
      groups.push(data.questionColumns.slice(i, i + 10));
    }
    return groups;
  }, [data.questionColumns]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Painel de Avaliação Institucional
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualização interativa dos resultados da pesquisa
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Respostas"
          value={filteredData.length}
          icon={ClipboardList}
          description={`de ${data.rows.length} registros`}
        />
        <StatsCard
          title="Funções Diferentes"
          value={roles.length}
          icon={Users}
        />
        <StatsCard
          title="Unidades Escolares"
          value={schools.length}
          icon={School}
        />
        <StatsCard
          title="Questões Analisadas"
          value={data.questionColumns.length}
          icon={BarChart3}
        />
      </div>

      {/* Filters */}
      <FilterPanel
        roles={roles}
        schools={schools}
        selectedRoles={selectedRoles}
        selectedSchools={selectedSchools}
        onRolesChange={setSelectedRoles}
        onSchoolsChange={setSelectedSchools}
      />

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard
          title="Distribuição por Função"
          data={roleChartData}
        />
        <PieChartCard
          title="Distribuição por Unidade Escolar"
          data={schoolChartData}
        />
      </div>

      {/* Question Bar Charts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Análise das Questões
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {questionGroups.map((questions, groupIndex) => (
            <BarChartCard
              key={groupIndex}
              title={`Questões ${groupIndex * 10 + 1} a ${groupIndex * 10 + questions.length}`}
              questions={questions}
              data={filteredData}
              groupIndex={groupIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
