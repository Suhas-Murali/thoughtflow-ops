import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>ThoughtFlow Ops — Dashboard</h1>
      <p>Welcome, {user?.email} ({user?.role})</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default DashboardPage;