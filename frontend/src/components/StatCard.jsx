function StatCard({ label, value }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        minWidth: '140px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{value}</p>
      <p style={{ color: '#6b7280', margin: '4px 0 0' }}>{label}</p>
    </div>
  );
}

export default StatCard;