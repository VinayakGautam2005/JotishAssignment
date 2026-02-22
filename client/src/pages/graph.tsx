import { useEmployees } from "@/hooks/use-employees";
import { Layout } from "@/components/layout";
import { parseSalary } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SalaryGraph() {
  const { data: employees, isLoading } = useEmployees();

  // Prepare data: take first 10, parse salary
  const data = employees?.slice(0, 10).map(emp => ({
    name: emp.name.split(' ')[0], // First name for cleaner x-axis
    fullName: emp.name,
    salary: parseSalary(emp.salary),
    role: emp.role
  })) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-border">
          <p className="font-bold font-display text-foreground">{payload[0].payload.fullName}</p>
          <p className="text-xs text-muted-foreground mb-2">{payload[0].payload.role}</p>
          <p className="text-primary font-bold">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Salary Analytics" showBack>
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-border shadow-sm">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground font-display">Salary Distribution</h3>
          <p className="text-muted-foreground text-sm">Top 10 employees by entry order</p>
        </div>

        <div className="h-[500px] w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-xl animate-pulse">
              Loading chart data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey="salary" 
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? 'var(--primary)' : 'var(--accent)'} 
                      className="opacity-90 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Layout>
  );
}
