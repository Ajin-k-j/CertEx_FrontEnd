import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CertificateIcon from "@mui/icons-material/CardMembership";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UserIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMsal } from "@azure/msal-react";
import axios from 'axios';

// Define role mapping
const roleMapping: Record<number, string> = {
  1: "Manager",
  2: "DepartmentHead",
  3: "AWSAdmin",
  4: "LnD",
  5: "LnDAdmin",
  6: "Employee", // Employee role mapping
};

const Navbar: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [view, setView] = useState<"user" | "role">("user");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { accounts, instance } = useMsal();
  const account = accounts[0];

  useEffect(() => {
    const fetchUserRole = async () => {
      if (account) {
        try {
          // Fetch user role
          const userData = await axios.get(`https://localhost:7209/api/Employee/verify/${account.username}`);
          const appRoleId = userData.data.appRoleId;
          setUserRole(roleMapping[appRoleId] || null);

          // Set display name
          setDisplayName(account.name || "User");
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      }
    };
    fetchUserRole();
  }, [account]);

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "user" | "role"
  ) => {
    if (newView !== null) {
      setView(newView);
      if (newView === "user") {
        navigate("/");
      } else {
        switch (userRole) {
          case "DepartmentHead":
            navigate("/department");
            break;
          case "LnDAdmin":
            navigate("/ld-admin");
            break;
          case "AWSAdmin":
            navigate("/aws-admin");
            break;
          default:
            navigate("/");
            break;
        }
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // Log out and redirect
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!userRole) {
    return null; 
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: "white",
        height: 50,
        justifyContent: "center",
        marginBottom: 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: "red",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          CertEx
        </Typography>

        {view === "user" ? (
          <>
            <Button
              color="inherit"
              sx={{
                fontSize: "0.75rem",
                padding: "13px 8px",
                color: location.pathname === "/" ? "blue" : "inherit",
                borderBottom:
                  location.pathname === "/" ? "2px solid blue" : "none",
              }}
              onClick={() => navigate("/")}
            >
              <CertificateIcon sx={{ marginRight: 0.5, fontSize: "0.75rem" }} />
              Available Certifications
            </Button>
            <Button
              color="inherit"
              sx={{
                fontSize: "0.75rem",
                padding: "13px 8px",
                marginLeft: ".5rem",
                marginRight: "2rem",
                color: location.pathname === "/dashboard" ? "blue" : "inherit",
                borderBottom:
                  location.pathname === "/dashboard"
                    ? "2px solid blue"
                    : "none",
              }}
              onClick={() => navigate("/dashboard")}
            >
              <DashboardIcon sx={{ marginRight: 0.5, fontSize: "0.75rem" }} />
              User Dashboard
            </Button>
          </>
        ) : (
          <>
            {userRole === "DepartmentHead" && (
              <Button
                color="inherit"
                sx={{
                  fontSize: '0.75rem',
                  padding: '14px 8px',
                  color: location.pathname.includes('department') ? 'blue' : 'inherit',
                  borderBottom: location.pathname.includes('department') ? '2px solid blue' : 'none',
                  marginRight: 4,
                }}
                onClick={() => navigate("/department")}
              >
                <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
                Department
              </Button>
            )}
            {userRole === "LnDAdmin" && (
              <Button
                color="inherit"
                sx={{
                  fontSize: '0.75rem',
                  padding: '14px 8px',
                  color: location.pathname.includes('ld-admin') ? 'blue' : 'inherit',
                  borderBottom: location.pathname.includes('ld-admin') ? '2px solid blue' : 'none',
                  marginRight: 4,
                }}
                onClick={() => navigate("/ld-admin")}
              >
                <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
                LD Admin
              </Button>
            )}
            {userRole === "AWSAdmin" && (
              <Button
                color="inherit"
                sx={{
                  fontSize: '0.75rem',
                  padding: '14px 8px',
                  color: location.pathname.includes('aws-admin') ? 'blue' : 'inherit',
                  borderBottom: location.pathname.includes('aws-admin') ? '2px solid blue' : 'none',
                  marginRight: 4,
                }}
                onClick={() => navigate("/aws-admin")}
              >
                <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
                AWS Admin
              </Button>
            )}
          </>
        )}

        {/* Show ToggleButtonGroup only if the role is not 'Employee' */}
        {userRole && userRole !== "Employee" && (
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            sx={{ marginRight: 4, marginLeft: 2 }}
          >
            <ToggleButton
              value="user"
              sx={{
                fontSize: "0.75rem",
                padding: "4px 8px",
                color: view === "user" ? "blue" : "inherit",
              }}
            >
              <UserIcon sx={{ marginRight: 0.5, fontSize: "0.75rem" }} />
              User
            </ToggleButton>
            <ToggleButton
              value="role"
              sx={{
                fontSize: "0.75rem",
                padding: "4px 8px",
                color: view === "role" ? "blue" : "inherit",
              }}
            >
              <AdminPanelSettingsIcon
                sx={{ marginRight: 0.5, fontSize: "0.75rem" }}
              />
              {userRole}
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        <IconButton
          edge="end"
          color="inherit"
          sx={{ width: 40, height: 40 }}
          onClick={handleMenuOpen}
        >
          <AccountCircleIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 2 }}
        >
          <MenuItem disabled>
            <Typography variant="body2">Welcome, {displayName}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
