import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, CircularProgress, Snackbar, Alert, Box, LinearProgress } from '@mui/material';
import { Payment, Visibility, Business, Category, TrendingUp, CheckCircle, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchFinanceAnalytics, clearError } from '../../store/analyticsSlice';

const FinanceDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { financeAnalytics: analytics, loading, error } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    if (!analytics) {
      dispatch(fetchFinanceAnalytics());
    }
  }, [dispatch, analytics]);

  useEffect(() => {
    const handleClaimProcessed = () => {
      dispatch(fetchFinanceAnalytics());
    };

    const handlePaymentProcessed = () => {
      dispatch(fetchFinanceAnalytics());
    };

    window.addEventListener('claimProcessed', handleClaimProcessed);
    window.addEventListener('paymentProcessed', handlePaymentProcessed);
    return () => {
      window.removeEventListener('claimProcessed', handleClaimProcessed);
      window.removeEventListener('paymentProcessed', handlePaymentProcessed);
    };
  }, [dispatch]);





  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ 
        minHeight: '100vh',
        background: '#ffffff',
        py: 4
      }}>
        <Container maxWidth="lg">


          {/* Analytics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)'
                }
              }}>
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h6">Approved Claims</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {((analytics?.approvedClaims || 0) + (analytics?.paidClaims || 0))}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ₹{((analytics?.pendingAmount || 0) + (analytics?.paidAmount || 0)).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)'
                }
              }}
              onClick={() => navigate('/process-payments')}
              >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Payment sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h6">Pending</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {analytics?.approvedClaims || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    For payment
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)'
                }
              }}>
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h6">Paid</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {analytics?.paidClaims || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ₹{analytics?.paidAmount?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)'
                }
              }}>
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalance sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h6">Balance</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    ₹{(analytics?.pendingAmount || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Pending Payment
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Cards */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ 
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Payment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Payment Processing
                    </Typography>
                  </Box>
                  
                  <Typography variant="h2" color="primary.main" sx={{ mb: 2, fontWeight: 700 }}>
                    {analytics?.approvedClaims || 0}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Manager-approved claims ready for reimbursement
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Payment Progress</Typography>
                      <Typography variant="body2">
                        {Math.round(((analytics?.paidClaims || 0) / Math.max(((analytics?.approvedClaims || 0) + (analytics?.paidClaims || 0)) || 1, 1)) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.round(((analytics?.paidClaims || 0) / Math.max(((analytics?.approvedClaims || 0) + (analytics?.paidClaims || 0)) || 1, 1)) * 100)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)'
                      }} 
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<Payment />}
                        onClick={() => navigate('/process-payments')}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 600,
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                        }}
                      >
                        Process Payments
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button 
                        variant="outlined"
                        fullWidth
                        startIcon={<Visibility />}
                        onClick={() => navigate('/finance-claims')}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 600,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2
                          }
                        }}
                      >
                        View All Claims
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ 
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)',
                mb: 3
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Business sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Department Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Manage company departments and organizational structure
                  </Typography>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/department-management')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    Manage Departments
                  </Button>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Category sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Category Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Manage expense categories and spending limits
                  </Typography>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/category-management')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    Manage Categories
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={4000} 
          onClose={() => dispatch(clearError())}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => dispatch(clearError())} 
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default FinanceDashboard;