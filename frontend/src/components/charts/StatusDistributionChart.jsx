import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatusDistributionChart({ data }) {
  const chartData = [
    { name: 'Prijavljeno', value: data.reported, fill: '#F57C00' },
    { name: 'U tijeku', value: data.in_progress, fill: '#1976D2' },
    { name: 'Riješeno', value: data.resolved, fill: '#4CAF50' },
    { name: 'Odbijeno', value: data.rejected, fill: '#9E9E9E' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Distribucija po statusu</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
