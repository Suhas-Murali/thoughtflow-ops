import { useAuth } from '../context/AuthContext';
import { useUpload } from '../context/UploadContext';
import FileUploader from '../components/FileUploader';

function DashboardPage() {
  const { user, logout } = useAuth();
  const { lastUploadResult } = useUpload();

  return (
    <div style={{ padding: '24px' }}>
      <h1>ThoughtFlow Ops — Dashboard</h1>
      <p>Welcome, {user?.email} ({user?.role})</p>
      <button onClick={logout}>Log Out</button>

      <h2 style={{ marginTop: '32px' }}>Upload a Test Failure Report</h2>
      <FileUploader />

      {lastUploadResult && (
        <div style={{ marginTop: '24px' }}>
          <h3>Last Upload Result</h3>
          <p>File: {lastUploadResult.originalName}</p>
          <p>Rows processed: {lastUploadResult.rowCount}</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;