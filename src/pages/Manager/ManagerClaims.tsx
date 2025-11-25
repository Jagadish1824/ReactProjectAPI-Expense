import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchApprovedClaims, fetchRejectedClaims, fetchPendingClaims, clearError } from '../../store/claimsSlice';


const ManagerClaims = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { approvedClaims, rejectedClaims, pendingClaims, loading, error } = useSelector((state: RootState) => state.claims);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Combine all claims for manager view
  const claims = useMemo(() => {
    const allClaims = [...approvedClaims, ...rejectedClaims, ...pendingClaims];
    return allClaims.sort((a, b) => 
      new Date(b.submissionDate || b.submittedDate || '').getTime() - 
      new Date(a.submissionDate || a.submittedDate || '').getTime()
    );
  }, [approvedClaims, rejectedClaims, pendingClaims]);

  const filteredClaims = claims.filter(claim => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) {
      const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
      return matchesStatus;
    }
    
    const matchesSearch = (claim.title || '').toLowerCase().includes(searchLower) ||
                         (claim.userName || '').toLowerCase().includes(searchLower) ||
                         (claim.categoryName || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    // Only fetch if we have no claims data at all
    const hasAnyData = approvedClaims.length > 0 || rejectedClaims.length > 0 || pendingClaims.length > 0;
    
    if (!hasAnyData) {
      dispatch(fetchApprovedClaims());
      dispatch(fetchRejectedClaims());
      dispatch(fetchPendingClaims());
    }
  }, [dispatch, approvedClaims.length, rejectedClaims.length, pendingClaims.length]);

  useEffect(() => {
    if (error) {
      setToast({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Submitted': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Paid': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        Loading...
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Claims History
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Search by title, employee, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {filteredClaims.map((claim) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={claim.claimId}>
            <Card sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {claim.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Employee: {claim.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Category: {claim.categoryName}
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
                  ₹{claim.amount.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Date: {new Date(claim.expenseDate).toLocaleDateString()}
                </Typography>
                <Chip 
                  label={claim.status} 
                  color={getStatusColor(claim.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredClaims.length === 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            No claims found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {claims.length === 0 ? 'No claims available.' : 'No claims match your search criteria.'}
          </Typography>
        </Card>
      )}

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManagerClaims;