import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartData } from "@/types/csv";

interface PieChartCardProps {
  title: string;
  data: ChartData[];
  colors?: string[];
}

const DEFAULT_COLORS = [
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

export function PieChartCard({ title, data, colors = DEFAULT_COLORS }: PieChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const chartData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {item.value} respostas ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${percentage}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
