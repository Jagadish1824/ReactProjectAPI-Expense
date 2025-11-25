import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, CircularProgress, Box, LinearProgress } from '@mui/material';
import { Approval, TrendingUp, CheckCircle, Cancel, PendingActions, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchManagerAnalytics, clearManagerAnalytics } from '../../store/analyticsSlice';

const ManagerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { managerAnalytics: analytics, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    // Always fetch fresh analytics when component mounts
    dispatch(fetchManagerAnalytics());
  }, [dispatch]);

  useEffect(() => {
    const handleClaimCreated = () => {
      // Clear cache and fetch fresh data
      dispatch(clearManagerAnalytics());
      dispatch(fetchManagerAnalytics());
    };

    const handleClaimProcessed = () => {
      // Clear cache and fetch fresh data
      dispatch(clearManagerAnalytics());
      dispatch(fetchManagerAnalytics());
    };

    window.addEventListener('claimCreated', handleClaimCreated);
    window.addEventListener('claimProcessed', handleClaimProcessed);
    return () => {
      window.removeEventListener('claimCreated', handleClaimCreated);
      window.removeEventListener('claimProcessed', handleClaimProcessed);
    };
  }, [dispatch]);



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
                  <Typography variant="h6">Total Claims</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {analytics?.totalClaims || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ₹{analytics?.totalAmount?.toLocaleString() || 0}
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
            onClick={() => navigate('/pending-approvals')}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PendingActions sx={{ fontSize: 32, mr: 2 }} />
                  <Typography variant="h6">Pending</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {analytics?.pendingClaims || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Needs review
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
                  {analytics?.approvedClaims || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  This month
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
                  <Cancel sx={{ fontSize: 32, mr: 2 }} />
                  <Typography variant="h6">Rejected</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {analytics?.rejectedClaims || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  This month
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
                  <Approval sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Pending Approvals
                  </Typography>
                </Box>
                
                <Typography variant="h2" color="primary.main" sx={{ mb: 2, fontWeight: 700 }}>
                  {analytics?.pendingClaims || 0}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Claims waiting for your review and approval
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Approval Progress</Typography>
                    <Typography variant="body2">
                      {Math.round(((analytics?.approvedClaims || 0) / Math.max(analytics?.totalClaims || 1, 1)) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.round(((analytics?.approvedClaims || 0) / Math.max(analytics?.totalClaims || 1, 1)) * 100)}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    }} 
                  />
                </Box>
                
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<Approval />}
                  onClick={() => navigate('/pending-approvals')}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                  }}
                >
                  Review Claims
                </Button>
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
                <Assessment sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Claims History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View all claims you've reviewed: approved, rejected & pending
                </Typography>
                <Button 
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/manager-claims')}
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
                  View History
                </Button>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Pending Amount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{analytics?.pendingAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Approved Amount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{((analytics?.totalAmount || 0) - (analytics?.pendingAmount || 0)).toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(((analytics?.pendingClaims || 0) / Math.max(analytics?.totalClaims || 1, 1)) * 100, 100)} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }} 
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                  {analytics?.pendingClaims || 0} pending of {analytics?.totalClaims || 0} total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManagerDashboard;