import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h1>ThoughtFlow Ops</h1>
      <p>Logged in: {isAuthenticated ? 'Yes' : 'No'}</p>
      {user && <p>Welcome, {user.email} ({user.role})</p>}
    </div>
  );
}

export default App;