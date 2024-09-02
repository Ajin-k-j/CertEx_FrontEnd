import React, { useEffect,} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import Navbar from './components/Navbar/Navbar';
import AllCertifications from './pages/AllCertifications/AllCertifications';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import Footer from './components/Footer/Footer';
import DepartmentAdminDashboard from './pages/DepartmentAdminDashboard/DepartmentAdminDashboard';
import LDAdminDashboard from './pages/LDAdminDashboard/LDAdminDashboard';
import AWSAdminDashboard from './pages/AwsAdminDashboard/AwsAdminDashboard';
import MessagePage from './pages/APIMessagePage/MessagePage';
import ReviewNomination from './pages/ReviewNomination/ReviewNomination';
import AwsAdminReview from './pages/AwsAdminReview/AwsAdminReview';
import LoginPage from './pages/LoginPage/LoginPage';
import { loginRequest } from './authconfig';
import './app.css';

const App: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();


  useEffect(() => {
    const getUserData = async () => {
      if (isAuthenticated && accounts.length > 0) {
        const account = accounts[0];
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: account,
          });
        } catch (e) {
          console.error("Silent token acquisition failed, fallback to interactive login:", e);
        }
      }
    };

    getUserData();
  }, [isAuthenticated, instance, accounts]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AllCertifications />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/department" element={<DepartmentAdminDashboard />} />
        <Route path="/ld-admin" element={<LDAdminDashboard />} />
        <Route path="/aws-admin" element={<AWSAdminDashboard />} />
        <Route path="/message" element={<MessagePage message="Default message" success={true} />} />
        <Route path="/review-nomination/:id" element={<ReviewNomination />} />
        <Route path="/aws-admin-review/:id" element={<AwsAdminReview />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
