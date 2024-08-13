import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserIcon from '@mui/icons-material/Person';
import CertificateIcon from '@mui/icons-material/CardMembership';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserData } from '../../api/NavbarApi';

type Role = 'user' | 'departmentHead' | 'LDAdmin' | 'AWSAdmin';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<Role>('user');
  const [, setUserName] = useState<string>('');
  const [view, setView] = useState<'user' | 'role'>('user');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserData()
      .then(userData => {
        setUserRole(userData.role);
        setUserName(userData.name);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    if (location.pathname === '/') {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: 'user' | 'role') => {
    if (newView !== null) {
      setView(newView);
      if (newView === 'user') {
        navigate('/', { replace: true });
      } else {
        switch (userRole) {
          case 'departmentHead':
            navigate('/department', { replace: true });
            break;
          case 'LDAdmin':
            navigate('/ld-admin', { replace: true });
            break;
          case 'AWSAdmin':
            navigate('/aws-admin', { replace: true });
            break;
        }
      }
    }
  };

  return (
    <AppBar position="relative" color="transparent" elevation={0} sx={{ marginBottom: 1, backgroundColor: 'white', height: 50 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', height: '50'}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'red', fontWeight: 'bold', fontSize: '1.2rem',marginBottom:2 }}>
          CertEx
        </Typography>

        {(location.pathname === '/' || location.pathname === '/dashboard') && (
          <>
            <Button
              color="inherit"
              sx={{
                marginBottom:1,
                fontSize: '0.75rem',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                height: '70%',
                color: location.pathname === '/' ? 'blue' : 'inherit',
                borderBottom: location.pathname === '/' ? '2px solid blue' : 'none',
                '& .MuiSvgIcon-root': {
                  display: location.pathname === '/' ? 'inline-block' : 'none',
                },
                '&:hover': {
                  color: 'blue',
                  backgroundColor: 'white',
                  borderBottom: '2px solid blue',
                  '& .MuiSvgIcon-root': {
                    display: 'inline-block',
                  },
                },
              }}
              onClick={() => navigate('/', { replace: true })}
            >
              <CertificateIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              Available Certifications
            </Button>
            <Button
              color="inherit"
              sx={{
                marginBottom:1,
                fontSize: '0.75rem',
                padding: '4px 8px',
                marginRight: '1px',
                display: 'flex',
                alignItems: 'center',
                height: '70%',
                color: location.pathname === '/dashboard' ? 'blue' : 'inherit',
                borderBottom: location.pathname === '/dashboard' ? '2px solid blue' : 'none',
                '& .MuiSvgIcon-root': {
                  display: location.pathname === '/dashboard' ? 'inline-block' : 'none',
                },
                '&:hover': {
                  color: 'blue',
                  marginRight: '1px',
                  backgroundColor: 'white',
                  borderBottom: '2px solid blue',
                  '& .MuiSvgIcon-root': {
                    display: 'inline-block',
                  },
                },
              }}
              onClick={() => navigate('/dashboard', { replace: true })}
            >
                           <DashboardIcon sx={{ marginRight: 1, fontSize: '0.75rem' }} />
              User Dashboard
            </Button>
          </>
        )}
        {(userRole !== 'user') && (
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            sx={{ marginRight: 2, marginLeft: 2 ,marginBottom:1}}
          >
            <ToggleButton
              id="user-toggle"
              value="user"
              aria-label="user view"
              sx={{
                
                borderRadius:'25px',
                fontSize: '0.75rem',
                padding: '4px 8px',
                color: view === 'user' ? 'blue' : 'inherit',
                '&.Mui-selected': {
                  color: 'blue',
                //   border: '2px solid blue',
                  
                },
              }}
            >
              <UserIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              User
            </ToggleButton>
            <ToggleButton
              id="role-toggle"
              value="role"
              aria-label="role view"
              sx={{
                
               
                borderRadius:'25px',
                fontSize: '0.75rem',
                padding: '4px 8px',
                color: view === 'role' ? 'blue' : 'inherit',
                '&.Mui-selected': {
                  color: 'blue',
                
                   
                },
              }}
            >
              {userRole === 'departmentHead' ? (
                <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              ) : (
                <AdminPanelSettingsIcon sx={{ marginRight: 0.5, fontSize: '0.75rem' }} />
              )}
              {userRole === 'departmentHead' ? 'Department' : userRole === 'LDAdmin' ? 'LD Admin' : 'AWS Admin'}
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenu}
          sx={{ width: 56, height: 56,marginBottom:1 }} // Adjust the button size
        >
          <AccountCircleIcon sx={{ fontSize: 40 }} /> {/* Increase the icon size */}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;