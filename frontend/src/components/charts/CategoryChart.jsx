import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CategoryChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Prijave po kategoriji</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1976D2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
