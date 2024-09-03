import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isAuthenticated && accounts.length > 0) {
        const account = accounts[0];
        try {
          await instance.acquireTokenSilent({
            ...loginRequest,
            account: account,
          });
        } catch (e) {
          console.error("Silent token acquisition failed, fallback to interactive login:", e);
        }
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, [isAuthenticated, instance, accounts]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const showNavbarAndFooter = isAuthenticated && location.pathname !== '/login';

  return (
    <>
      {showNavbarAndFooter && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/message" element={<MessagePage message="Default message" success={true} />} />
        <Route path="/review-nomination/:id" element={<ReviewNomination />} />
        <Route path="/aws-admin-review/:id" element={<AwsAdminReview />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<AllCertifications />} />
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/department" element={<DepartmentAdminDashboard />} />
            <Route path="/ld-admin" element={<LDAdminDashboard />} />
            <Route path="/aws-admin" element={<AWSAdminDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      {showNavbarAndFooter && <Footer />}
    </>
  );
};

export default App;
