import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Stack } from '@mui/material';
import { Payment, Visibility } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchApprovedClaims, clearError } from '../../store/claimsSlice';
import { processPayment, clearError as clearPaymentError } from '../../store/approvalsSlice';
import { invalidateFinanceAnalytics } from '../../store/analyticsSlice';
import type { ClaimDto } from '../../types/User';

const ProcessPayments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { approvedClaims, loading, error } = useSelector((state: RootState) => state.claims);
  const { loading: paymentLoading, error: paymentError } = useSelector((state: RootState) => state.approvals);
  
  // Filter to show only manager-approved claims that are not yet paid
  const claims = approvedClaims.filter((claim: ClaimDto) => 
    claim.status === 'Approved'
  );
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimDto | null>(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: '',
    transactionReference: '',
    status: 'Paid'
  });

  const generateUniqueTransactionRef = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TXN${timestamp}${random}`;
  };

  useEffect(() => {
    // Only fetch if no approved claims data exists
    if (approvedClaims.length === 0) {
      dispatch(fetchApprovedClaims());
    }
  }, [dispatch, approvedClaims.length]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (paymentError) {
      showToast(paymentError, 'error');
      dispatch(clearPaymentError());
    }
  }, [paymentError, dispatch]);

  const handleProcessPayment = (claim: ClaimDto) => {
    setSelectedClaim(claim);
    setPaymentData({
      paymentMethod: '',
      transactionReference: generateUniqueTransactionRef(),
      status: 'Paid'
    });
    setPaymentDialog(true);
  };

  const handleViewDetails = (claim: ClaimDto) => {
    setSelectedClaim(claim);
    setViewDialog(true);
  };

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const validatePaymentData = () => {
    const { paymentMethod, transactionReference } = paymentData;
    
    if (!paymentMethod) {
      showToast('Payment method is required', 'error');
      return false;
    }
    
    if (!['Bank Transfer', 'UPI', 'Check'].includes(paymentMethod)) {
      showToast('Payment method must be Bank Transfer, UPI, or Check', 'error');
      return false;
    }
    
    if (!transactionReference) {
      showToast('Transaction reference is required', 'error');
      return false;
    }
    
    if (transactionReference.length < 3 || transactionReference.length > 100) {
      showToast('Transaction reference must be between 3 and 100 characters', 'error');
      return false;
    }
    
    if (!/^[A-Z0-9]+$/.test(transactionReference)) {
      showToast('Transaction reference must contain only uppercase letters and numbers', 'error');
      return false;
    }
    
    if (!/[A-Z]/.test(transactionReference) || !/[0-9]/.test(transactionReference)) {
      showToast('Transaction reference must contain both letters and numbers', 'error');
      return false;
    }
    
    return true;
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentData() || !selectedClaim) {
      return;
    }

    const result = await dispatch(processPayment({
      ClaimId: selectedClaim.claimId,
      PaymentMethod: paymentData.paymentMethod,
      TransactionReference: paymentData.transactionReference,
      Amount: selectedClaim.amount,
      Status: paymentData.status
    }));
    
    if (processPayment.fulfilled.match(result)) {
      showToast(`Successfully processed payment for ${selectedClaim.title}`, 'success');
      setPaymentDialog(false);
      setSelectedClaim(null);
      setPaymentData({ paymentMethod: '', transactionReference: generateUniqueTransactionRef(), status: 'Paid' });
      // Invalidate analytics cache to force refresh
      dispatch(invalidateFinanceAnalytics());
      // Refresh approved claims after payment
      dispatch(fetchApprovedClaims());
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
      <Typography variant="h4" component="h1" gutterBottom sx={{
        fontSize: { xs: '1.75rem', sm: '2.125rem' },
        textAlign: { xs: 'center', sm: 'left' },
        mb: 3
      }}>
        Process Payments
      </Typography>
      

      

      
      <Grid container spacing={3}>
        {claims.map((claim) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={claim.claimId}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                  label="Pending Payment" 
                  color="warning"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Payment />}
                    fullWidth
                    onClick={() => handleProcessPayment(claim)}
                    sx={{ 
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' }
                    }}
                  >
                    Process Payment
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    fullWidth
                    onClick={() => handleViewDetails(claim)}
                    sx={{ 
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' }
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {claims.length === 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            No approved claims found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All approved claims have been processed for payment.
          </Typography>
        </Card>
      )}

      {/* Payment Details Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth disableEnforceFocus disableRestoreFocus hideBackdrop>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Processing payment for: <strong>{selectedClaim.title}</strong><br/>
              Employee: {selectedClaim.userName}<br/>
              Amount: <strong>₹{selectedClaim.amount.toFixed(2)}</strong>
            </Typography>
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
              label="Payment Method"
            >
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Transaction Reference"
            value={paymentData.transactionReference}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              setPaymentData({...paymentData, transactionReference: value});
            }}
            margin="normal"
            placeholder="e.g., TXN123456789"
            helperText="3-100 characters, must contain both letters and numbers"
            inputProps={{ maxLength: 100 }}
            error={paymentData.transactionReference.length > 0 && (
              paymentData.transactionReference.length < 3 || 
              !/^[A-Z0-9]+$/.test(paymentData.transactionReference) ||
              !/[A-Z]/.test(paymentData.transactionReference) ||
              !/[0-9]/.test(paymentData.transactionReference)
            )}
          />
          
          <TextField
            fullWidth
            label="Status"
            value="Paid"
            margin="normal"
            InputProps={{ readOnly: true }}
            helperText="Status will be set to Paid automatically"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePaymentSubmit} 
            variant="contained"
            disabled={paymentLoading || !paymentData.paymentMethod || !paymentData.transactionReference}
          >
            {paymentLoading ? 'Processing...' : 'Process Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth disableEnforceFocus disableRestoreFocus hideBackdrop>
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <>
              <Typography variant="h6" gutterBottom>{selectedClaim.title}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Employee:</strong> {selectedClaim.userName}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Category:</strong> {selectedClaim.categoryName}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Amount:</strong> ₹{selectedClaim.amount.toFixed(2)}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Date:</strong> {new Date(selectedClaim.expenseDate).toLocaleDateString()}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Status:</strong> {selectedClaim.status}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Description:</strong> {selectedClaim.description || 'No description provided'}</Typography>
              
              {selectedClaim.receiptImage && (
                <div>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Receipt Image:</strong></Typography>
                  <img 
                    src={selectedClaim.receiptImage}
                    alt="Receipt"
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #ddd' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorMsg = document.createElement('div');
                      errorMsg.textContent = 'Receipt image not available';
                      errorMsg.style.color = '#666';
                      target.parentNode!.appendChild(errorMsg);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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

export default ProcessPayments;