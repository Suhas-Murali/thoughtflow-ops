import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const SEVERITY_COLORS = { LOW: '#22c55e', MEDIUM: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444' };

function FailureCharts({ byCategory, bySeverity }) {
  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '32px' }}>
      <div style={{ width: '550px', height: '340px' }}>
        <h3>Failures by Category</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={byCategory} margin={{ bottom: 60 }}>
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '400px', height: '300px' }}>
        <h3>Failures by Severity</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={bySeverity} dataKey="count" nameKey="severity" outerRadius={90} label>
              {bySeverity.map((entry) => (
                <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#999'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FailureCharts;