import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, CircularProgress, Box, Chip } from '@mui/material';
import { Add, Receipt, FilterList, TrendingUp, PendingActions, CheckCircle, PieChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchUserClaims } from '../../store/claimsSlice';
import { fetchEmployeeAnalytics } from '../../store/analyticsSlice';

const EmployeeDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userClaims: claims, loading } = useSelector((state: RootState) => state.claims);
  const { employeeAnalytics } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    // Check if we need fresh data (always fetch on mount to ensure latest status)
    dispatch(fetchEmployeeAnalytics());
  }, [dispatch]);

  useEffect(() => {
    // Always fetch fresh claims to ensure latest status
    dispatch(fetchUserClaims());
  }, [dispatch]);

  useEffect(() => {
    const handleClaimCreated = () => {
      dispatch(fetchUserClaims());
      dispatch(fetchEmployeeAnalytics());
    };

    const handleClaimProcessed = () => {
      // Clear cache and fetch fresh data
      dispatch(fetchUserClaims());
      dispatch(fetchEmployeeAnalytics());
    };

    const handlePaymentProcessed = () => {
      // Clear cache and fetch fresh data
      dispatch(fetchUserClaims());
      dispatch(fetchEmployeeAnalytics());
    };

    window.addEventListener('claimCreated', handleClaimCreated);
    window.addEventListener('claimProcessed', handleClaimProcessed);
    window.addEventListener('paymentProcessed', handlePaymentProcessed);
    return () => {
      window.removeEventListener('claimCreated', handleClaimCreated);
      window.removeEventListener('claimProcessed', handleClaimProcessed);
      window.removeEventListener('paymentProcessed', handlePaymentProcessed);
    };
  }, [dispatch]);



  const pendingClaims = employeeAnalytics?.pendingClaims || claims.filter(c => c.status === 'Pending' || c.status === 'Submitted').length;
  const approvedClaims = employeeAnalytics?.approvedClaims || claims.filter(c => c.status === 'Approved').length;
  const totalAmount = employeeAnalytics?.totalAmount || claims.reduce((sum, claim) => sum + claim.amount, 0);
  const recentClaims = claims.slice(0, 3);

  // Calculate category-wise spending for paid claims only
  const paidClaims = claims.filter(claim => claim.status === 'Paid');
  const categorySpending = paidClaims.reduce((acc, claim) => {
    const category = claim.categoryName || 'Other';
    acc[category] = (acc[category] || 0) + claim.amount;
    return acc;
  }, {} as Record<string, number>);

  const paidTotalAmount = paidClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const categoryData = Object.entries(categorySpending).map(([name, amount]) => ({
    name,
    amount,
    percentage: paidTotalAmount > 0 ? (amount / paidTotalAmount) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  const colors = ['#667eea', '#f093fb', '#4facfe', '#fa709a', '#ffeaa7', '#fd79a8', '#fdcb6e', '#6c5ce7'];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#ffffff',
      py: 4
    }}>
      <Container maxWidth="lg">


        {/* Stats Cards */}
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
                  <Typography variant="h6">Total Claims</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {employeeAnalytics?.totalClaims || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ₹{totalAmount.toLocaleString()}
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
                  <PendingActions sx={{ fontSize: 32, mr: 2 }} />
                  <Typography variant="h6">Pending</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {pendingClaims}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Awaiting approval
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
                  <Typography variant="h6">Approved</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {approvedClaims}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Ready for payment
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
            onClick={() => navigate('/create-claim')}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Add sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>New Expense</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Submit new claim
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Category Spending Chart */}
        {categoryData.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={12}>
              <Card sx={{ 
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PieChart sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Paid Claims by Category
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ 
                        position: 'relative',
                        width: 200,
                        height: 200,
                        margin: '0 auto',
                        borderRadius: '50%',
                        background: `conic-gradient(${categoryData.map((_, index) => 
                          `${colors[index % colors.length]} ${categoryData.slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0)}% ${categoryData.slice(0, index + 1).reduce((sum, prev) => sum + prev.percentage, 0)}%`
                        ).join(', ')})`
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'white',
                          borderRadius: '50%',
                          width: 100,
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ₹{paidTotalAmount.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Paid
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {categoryData.map((item, index) => (
                          <Box key={item.name} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 1.5,
                            borderRadius: 1,
                            background: 'rgba(0,0,0,0.02)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: colors[index % colors.length],
                                mr: 2
                              }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.name}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ₹{item.amount.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Claims
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={() => navigate('/my-claims')}
                    sx={{ borderRadius: 2 }}
                  >
                    View All
                  </Button>
                </Box>
                
                {recentClaims.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentClaims.map((claim) => (
                      <Box key={claim.claimId} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        background: 'rgba(0,0,0,0.02)',
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {claim.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {claim.categoryName} • {new Date(claim.expenseDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            ₹{claim.amount.toLocaleString()}
                          </Typography>
                          <Chip 
                            label={claim.status}
                            size="small"
                            color={claim.status === 'Approved' ? 'success' : claim.status === 'Pending' ? 'warning' : 'default'}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No claims submitted yet
                    </Typography>
                  </Box>
                )}
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
                <FilterList sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Manage Claims
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View, edit and track all your expense claims
                </Typography>
                <Button 
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/my-claims')}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                  }}
                >
                  View All Claims
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployeeDashboard;