import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllCertifications from './pages/AllCertifications/AllCertifications';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<AllCertifications />} />
          <Route path="/user-dashboard" element={<EmployeeDashboard />} />
          {/* Redirect any unknown routes to the main page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
