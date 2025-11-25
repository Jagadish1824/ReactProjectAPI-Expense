import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Logout, Home } from '@mui/icons-material';
import type { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { UserRole } from '../../types/User';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const isDashboardPage = location.pathname.includes('dashboard');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const handleHome = () => {
    if (user?.role === UserRole.Employee) {
      navigate('/employee-dashboard');
    } else if (user?.role === UserRole.Manager) {
      navigate('/manager-dashboard');
    } else if (user?.role === UserRole.Finance) {
      navigate('/finance-dashboard');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <Toolbar sx={{ 
        minHeight: { xs: 56, sm: 64 }, 
        px: { xs: 2, sm: 3 }, 
        width: '100%', 
        maxWidth: 'none',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 4px 12px rgba(254, 107, 139, 0.3)'
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              K
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.3rem' }, 
              fontWeight: 700, 
              color: 'white', 
              cursor: 'pointer',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={() => navigate('/')}
          >
            KANINI
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              {!isDashboardPage && (
                <Button
                  onClick={handleHome}
                  startIcon={<Home />}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease',
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  Dashboard
                </Button>
              )}
              
              {isDashboardPage && (
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  display: { xs: 'none', md: 'inline' },
                  fontWeight: 500
                }}>
                  Welcome, {user?.name}
                </Typography>
              )}
              
              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  p: 0,
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <Avatar sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 4px 12px rgba(254, 107, 139, 0.3)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    minWidth: 180
                  }
                }}
              >
                {!isDashboardPage && (
                  <MenuItem onClick={() => { handleHome(); handleMenuClose(); }}>
                    <Home sx={{ mr: 2 }} />
                    Dashboard
                  </MenuItem>
                )}
                {isDashboardPage && (
                  <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                    <Logout sx={{ mr: 2 }} />
                    Logout
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Button 
                component={Link}
                to="/login"
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Login
              </Button>
              <Button 
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(254, 107, 139, 0.3)',
                  '&:hover': { 
                    boxShadow: '0 6px 16px rgba(254, 107, 139, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;