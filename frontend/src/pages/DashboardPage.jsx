import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUpload } from '../context/UploadContext';
import { getDashboardStats } from '../services/api';
import FileUploader from '../components/FileUploader';
import StatCard from '../components/StatCard';
import FailureCharts from '../components/FailureCharts';
import FailureTable from '../components/FailureTable';

function DashboardPage() {
  const { user, logout } = useAuth();
  const { lastUploadResult } = useUpload();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const data = await getDashboardStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Refresh stats whenever a new upload finishes
  useEffect(() => {
    if (lastUploadResult) {
      loadStats();
    }
  }, [lastUploadResult]);

  return (
    <div style={{ padding: '24px' }}>
      <h1>ThoughtFlow Ops — Dashboard</h1>
      <p>Welcome, {user?.email} ({user?.role})</p>
      <button onClick={logout}>Log Out</button>

      <h2 style={{ marginTop: '32px' }}>Overview</h2>
      {loading && <p>Loading stats...</p>}
      {stats && (
        <>
          <div style={{ display: 'flex', gap: '16px' }}>
            <StatCard label="Total Failures" value={stats.totalFailures} />
            <StatCard label="Files Uploaded" value={stats.totalFiles} />
          </div>
          <FailureCharts byCategory={stats.byCategory} bySeverity={stats.bySeverity} />
        </>
      )}

      <FailureTable />

      <h2 style={{ marginTop: '32px' }}>Upload a Test Failure Report</h2>
      <FileUploader />
    </div>
  );
}

export default DashboardPage;