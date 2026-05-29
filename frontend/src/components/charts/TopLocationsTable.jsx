export default function TopLocationsTable({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Najproblematičnije lokacije</h3>
      <table className="table-auto w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">#</th>
            <th className="text-left py-2 px-3">Lokacija</th>
            <th className="text-left py-2 px-3">Broj prijava</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((location, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-3">{index + 1}</td>
              <td className="py-2 px-3">{location.address}</td>
              <td className="py-2 px-3">{location.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
