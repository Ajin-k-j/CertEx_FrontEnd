import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AllCertifications from "./pages/AllCertifications/AllCertifications";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import Footer from "./components/Footer/Footer";
import DepartmentAdminDashboard from "./pages/DepartmentAdminDashboard/DepartmentAdminDashboard";
import LDAdminDashboard from "./pages/LDAdminDashboard/LDAdminDashboard";
import AWSAdminDashboard from "./pages/AwsAdminDashboard/AwsAdminDashboard";
import MessagePage from "./pages/APIMessagePage/MessagePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<AllCertifications />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/department" element={<DepartmentAdminDashboard />} />
        <Route path="/ld-admin" element={<LDAdminDashboard />} />
        <Route path="/aws-admin" element={<AWSAdminDashboard />} />
        <Route
          path="/message"
          element={<MessagePage message="Default message" success={true} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
