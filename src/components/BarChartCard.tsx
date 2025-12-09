import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { CSVRow } from "@/types/csv";
import { countValues } from "@/utils/xlsxParser";

interface BarChartCardProps {
  title: string;
  questions: string[];
  data: CSVRow[];
  groupIndex: number;
}

const COLORS = [
  "hsl(210, 80%, 45%)",
  "hsl(175, 60%, 40%)",
  "hsl(45, 90%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(15, 85%, 55%)",
  "hsl(195, 75%, 45%)",
  "hsl(130, 50%, 45%)",
  "hsl(260, 50%, 55%)",
  "hsl(30, 80%, 50%)",
];

export function BarChartCard({ title, questions, data, groupIndex }: BarChartCardProps) {
  // Get all unique answer values across all questions
  const allAnswers = new Set<string>();
  questions.forEach(q => {
    data.forEach(row => {
      const val = row[q]?.trim();
      if (val) allAnswers.add(val);
    });
  });
  const answerKeys = Array.from(allAnswers).sort();

  // Build chart data: one object per question with counts for each answer
  const chartData = questions.map((question, idx) => {
    const counts = countValues(data, question);
    const entry: Record<string, string | number> = {
      question: `Q${groupIndex * 10 + idx + 1}`,
      fullQuestion: question,
    };
    answerKeys.forEach(key => {
      entry[key] = counts[key] || 0;
    });
    return entry;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = chartData.find(d => d.question === label);
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs">
          <p className="font-medium text-foreground text-sm mb-2 line-clamp-3">
            {item?.fullQuestion}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </span>
                <span className="font-medium text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="question" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
            {answerKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="font-medium mb-2">Legenda das questões:</p>
        <ul className="space-y-1 max-h-32 overflow-y-auto">
          {questions.map((q, idx) => (
            <li key={idx} className="line-clamp-1">
              <span className="font-medium">Q{groupIndex * 10 + idx + 1}:</span> {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
