import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';

import UserDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import AllCertifications from './pages/AllCertifications/AllCertifications';
import Department from './pages/DepartmentPage/DepartmentTotalCard/DepartmentTotalDataCard';
import LDAdmin from './pages/LDPage/LDDemo';
import AWSAdmin from './pages/AWSPage/AWSTotalDataCard/AWSTotalDataCard'



function App() {
  return (
    <>
      <ToastContainer />
      <Router>
      <Navbar />
        <Routes>
        <Route path="/" element={<AllCertifications />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/department" element={<Department />} />
        <Route path="/ld-admin" element={<LDAdmin />} />
        <Route path="/aws-admin" element={<AWSAdmin />} />

        </Routes>
        <Footer />
      </Router>
      
    </>
  );
}

export default App;
