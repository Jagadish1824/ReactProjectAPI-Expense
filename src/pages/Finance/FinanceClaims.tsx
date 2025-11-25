import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Chip, TextField, Alert} from '@mui/material';
import { Search } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchPaidClaims, clearError } from '../../store/claimsSlice';

const FinanceClaims = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { paidClaims: claims, loading, error } = useSelector((state: RootState) => state.claims);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (claims.length === 0) {
      dispatch(fetchPaidClaims());
    }
  }, [dispatch, claims.length]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }); 

  const getStatusColor = (status: string) => {
    switch (status) {
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
        Paid Claims - Finance View
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12}>
          <TextField
            fullWidth
            placeholder="Search by title, category, or employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>

      </Grid>
      
      <Grid container spacing={3}>
        {filteredClaims.map((claim) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={claim.claimId}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {claim.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Employee: {claim.employeeName || claim.userName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Category: {claim.categoryName}
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
                  ₹{claim.amount.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Expense Date: {new Date(claim.expenseDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Submitted: {new Date(claim.submissionDate || claim.submittedDate).toLocaleDateString()}
                </Typography>
                {claim.paymentDate && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Paid: {new Date(claim.paymentDate).toLocaleDateString()}
                  </Typography>
                )}
                {claim.paymentMethod && (
                  <Typography variant="body2" color="info.main" sx={{ mb: 1 }}>
                    Method: {claim.paymentMethod}
                  </Typography>
                )}
                <Chip 
                  label={claim.status} 
                  color={getStatusColor(claim.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  size="small"
                  sx={{ mb: 1, alignSelf: 'flex-start' }}
                />
                {claim.status === 'Rejected' && claim.comments && (
                  <Typography variant="body2" color="error.main" sx={{ mb: 1, fontStyle: 'italic' }}>
                    Reason: {claim.comments}
                  </Typography>
                )}
                {claim.status === 'Paid' && claim.transactionReference && (
                  <Typography variant="body2" color="info.main" sx={{ mb: 1, fontStyle: 'italic' }}>
                    Ref: {claim.transactionReference}
                  </Typography>
                )}
                {claim.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', pt: 1 }}>
                    {claim.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredClaims.length === 0 && claims.length > 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            No paid claims found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No paid claims match your search criteria.
          </Typography>
        </Card>
      )}

      {claims.length === 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            No paid claims available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No claims have been paid yet.
          </Typography>
        </Card>
      )}
    </Container>
  );
};

export default FinanceClaims;