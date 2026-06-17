import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

    </AuthProvider>
  );
}

export default App;
