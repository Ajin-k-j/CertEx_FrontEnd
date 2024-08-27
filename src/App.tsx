import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AllCertifications from './pages/AllCertifications/AllCertifications';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import Footer from './components/Footer/Footer';
import DepartmentAdminDashboard from './pages/DepartmentAdminDashboard/DepartmentAdminDashboard';
import LDAdminDashboard from './pages/LDAdminDashboard/LDAdminDashboard';
import AWSAdminDashboard from './pages/AwsAdminDashboard/AwsAdminDashboard';
import MessagePage from './pages/APIMessagePage/MessagePage';
import CertificationManagementModal from './components/AllCertificationsAdmin/AllCertificationsManagement';
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AllCertifications />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/department" element={<DepartmentAdminDashboard />} />
        <Route path="/ld-admin" element={<LDAdminDashboard />} />
        <Route path="/aws-admin" element={<AWSAdminDashboard />} />
        <Route path="/cm" element={<CertificationManagementModal />} />
        <Route path="/message" element={<MessagePage message="Default message" success={true} />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
