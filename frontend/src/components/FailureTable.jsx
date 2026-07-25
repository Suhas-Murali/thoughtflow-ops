import { useState, useEffect, useCallback } from 'react';
import { getFailures } from '../services/api';

const CATEGORIES = ['DATABASE_ERROR', 'UI_FLAKINESS', 'AUTH_FAILURE', 'NETWORK_ERROR', 'UNKNOWN', 'PENDING_ANALYSIS'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const SEVERITY_COLORS = { LOW: '#22c55e', MEDIUM: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444' };

function FailureTable() {
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadFailures = useCallback(async () => {
    setLoading(true);
    const data = await getFailures({ search, category, severity, sortBy, sortOrder });
    setFailures(data);
    setLoading(false);
  }, [search, category, severity, sortBy, sortOrder]);

  useEffect(() => {
    // Debounce: wait 400ms after the user stops typing/changing filters before fetching
    const timeout = setTimeout(() => {
      loadFailures();
    }, 400);
    return () => clearTimeout(timeout);
  }, [loadFailures]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <h2>Failure Log</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search test ID, name, or summary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', minWidth: '240px' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('testId')}>
                Test ID {sortBy === 'testId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('category')}>
                Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('severity')}>
                Severity {sortBy === 'severity' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '8px' }}>Summary</th>
              <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {failures.map((f) => (
              <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '8px' }}>{f.testId}</td>
                <td style={{ padding: '8px' }}>{f.category}</td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      backgroundColor: SEVERITY_COLORS[f.severity] || '#999',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {f.severity}
                  </span>
                </td>
                <td style={{ padding: '8px' }}>{f.cleanSummary}</td>
                <td style={{ padding: '8px' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && failures.length === 0 && <p>No failures match your filters.</p>}
    </div>
  );
}

export default FailureTable;