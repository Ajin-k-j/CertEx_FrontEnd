import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CertificateIcon from '@mui/icons-material/CardMembership';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UserIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type Role = 'user' | 'departmentHead' | 'LDAdmin' | 'AWSAdmin';

const fetchUserRole = (): Role => {
  // Dummy function to simulate fetching user role
  return 'user';
};

const Navbar: React.FC = () => {
  const [userRole, setUserRole] = useState<Role>('user');
  const [view, setView] = useState<'user' | 'role'>('user');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = fetchUserRole();
    setUserRole(role);
  }, []);

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: 'user' | 'role') => {
    if (newView !== null) {
      setView(newView);
      if (newView === 'user') {
        navigate('/');
      } else {
        switch (userRole) {
          case 'departmentHead':
            navigate('/department');
            break;
          case 'LDAdmin':
            navigate('/ld-admin');
            break;
          case 'AWSAdmin':
            navigate('/aws-admin');
            break;
        }
      }
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: 'white', height: 50 ,justifyContent:'center', marginBottom:1}}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', height: 50 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
          CertEx
        </Typography>

        {view === 'user' ? (
          <>
            <Button
              color="inherit"
              sx={{
                fontSize: '0.75rem',
                padding: '13px 8px',
                color: location.pathname === '/' ? 'blue' : 'inherit',
                borderBottom: location.pathname === '/' ? '2px solid blue' : 'none',
              }}
              onClick={() => navigate('/')}
            >
              <CertificateIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              Available Certifications
            </Button>
            <Button
              color="inherit"
              sx={{
                fontSize: '0.75rem',
                padding: '13px 8px',
                marginLeft:'.5rem',
                marginRight:'2rem',
                color: location.pathname === '/dashboard' ? 'blue' : 'inherit',
                borderBottom: location.pathname === '/dashboard' ? '2px solid blue' : 'none',
              }}
              onClick={() => navigate('/dashboard')}
            >
              <DashboardIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              User Dashboard
            </Button>
          </>
        ) : (
          <>
          {/* for adding buttons in admin nav use the below code */}
            {/* <Button
              color="inherit"
              sx={{
                fontSize: '0.75rem',
                padding: '14px 8px',
                color: location.pathname.includes('admin') ? 'blue' : 'inherit',
                borderBottom: location.pathname.includes('admin') ? '2px solid blue' : 'none',
              }}
              onClick={() => navigate(`/${userRole.toLowerCase().replace('admin', '-admin')}`)}
            >
              <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              {userRole === 'departmentHead' ? 'Department' : userRole === 'LDAdmin' ? 'LD Admin' : 'AWS Admin'}
            </Button> */}
          </>
        )}

        {userRole !== 'user' && (
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            sx={{ marginRight: 2, marginLeft: 2 }}
          >
            <ToggleButton value="user" sx={{ fontSize: '0.75rem', padding: '4px 8px', color: view === 'user' ? 'blue' : 'inherit' }}>
              <UserIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              User
            </ToggleButton>
            <ToggleButton value="role" sx={{ fontSize: '0.75rem', padding: '4px 8px', color: view === 'role' ? 'blue' : 'inherit' }}>
              <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              {userRole === 'departmentHead' ? 'Department' : userRole === 'LDAdmin' ? 'LD Admin' : 'AWS Admin'}
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        <IconButton edge="end" color="inherit" sx={{ width: 40, height: 40 }}>
          <AccountCircleIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
