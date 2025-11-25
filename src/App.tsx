import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './pages/Default/Navbar';
import HomePage from './pages/Default/HomePage';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Footer from './pages/Default/Footer';
import ProtectedRoute from './auth/ProtectedRoute';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import FinanceDashboard from './pages/Finance/FinanceDashboard';
import CreateClaim from './pages/Employee/CreateClaim';
import MyClaims from './pages/Employee/MyClaims';
import PendingApprovals from './pages/Manager/PendingApprovals';
import ManagerClaims from './pages/Manager/ManagerClaims';
import ProcessPayments from './pages/Finance/ProcessPayments';
import DepartmentManagement from './pages/Finance/DepartmentManagement';
import CategoryManagement from './pages/Finance/CategoryManagement';
import FinanceClaims from './pages/Finance/FinanceClaims';
import { UserRole } from './types/User';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d9488',
    },
    secondary: {
      main: '#14b8a6',
    },
    background: {
      default: '#ffffff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 'clamp(0.8rem, 1.1vw, 0.875rem)',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 'clamp(16px, 4vw, 32px)',
          paddingRight: 'clamp(16px, 4vw, 32px)',
          '@media (max-width: 599px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '@media (max-width: 599px)': {
            '& .MuiGrid-item': {
              paddingLeft: '8px',
              paddingTop: '8px',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
          padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
          '@media (max-width: 599px)': {
            minHeight: '44px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '@media (max-width: 599px)': {
            margin: '8px 0',
            borderRadius: 8,
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 'clamp(16px, 3vw, 24px)',
          '&:last-child': {
            paddingBottom: 'clamp(16px, 3vw, 24px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 'clamp(16px, 4vw, 32px)',
          width: 'calc(100% - clamp(32px, 8vw, 64px))',
          '@media (max-width: 599px)': {
            margin: '16px',
            width: 'calc(100% - 32px)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (hover: none) and (pointer: coarse)': {
            padding: '12px',
            minHeight: '44px',
            minWidth: '44px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute roles={[UserRole.Employee]} />}>
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="/create-claim" element={<CreateClaim />} />
              <Route path="/my-claims" element={<MyClaims />} />
            </Route>
            
            <Route element={<ProtectedRoute roles={[UserRole.Manager]} />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/pending-approvals" element={<PendingApprovals />} />
              <Route path="/manager-claims" element={<ManagerClaims />} />
            </Route>
            
            <Route element={<ProtectedRoute roles={[UserRole.Finance]} />}>
              <Route path="/finance-dashboard" element={<FinanceDashboard />} />
              <Route path="/process-payments" element={<ProcessPayments />} />
              <Route path="/department-management" element={<DepartmentManagement />} />
              <Route path="/category-management" element={<CategoryManagement />} />
              <Route path="/finance-claims" element={<FinanceClaims />} />
            </Route>
            
            {/* Forbidden Route */}
            <Route path="/forbidden" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h1>Access Denied</h1>
                    <p>You don't have permission to access this page.</p>
                  </div>
                </Box>
                <Footer />
              </Box>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;