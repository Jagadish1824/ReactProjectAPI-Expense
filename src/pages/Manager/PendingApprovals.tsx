import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Box, Stack } from '@mui/material';
import { CheckCircle, Cancel, Visibility, Image } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchPendingClaims, clearError, invalidateApprovedClaims, invalidateRejectedClaims } from '../../store/claimsSlice';
import { processApproval, clearError as clearApprovalError } from '../../store/approvalsSlice';
import { invalidateManagerAnalytics } from '../../store/analyticsSlice';
import type { ClaimDto } from '../../types/User';

const PendingApprovals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingClaims: claims, loading, error } = useSelector((state: RootState) => state.claims);
  const { error: approvalError } = useSelector((state: RootState) => state.approvals);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimDto | null>(null);
  const [approvalData, setApprovalData] = useState({
    status: '',
    comments: ''
  });
  const [localError, setLocalError] = useState('');
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (claims.length === 0 && !fetchingRef.current) {
      fetchingRef.current = true;
      dispatch(fetchPendingClaims()).finally(() => {
        fetchingRef.current = false;
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (approvalError) {
      setLocalError(approvalError);
      dispatch(clearApprovalError());
    }
  }, [approvalError, dispatch]);

  const handleApproval = (claim: ClaimDto, status: 'Approved' | 'Rejected') => {
    setSelectedClaim(claim);
    setApprovalData({ status, comments: '' });
    setApprovalDialog(true);
  };

  const handleView = (claim: ClaimDto) => {
    setSelectedClaim(claim);
    setViewDialog(true);
  };

  const handleApprovalSubmit = async () => {
    if (!selectedClaim) return;
    
    if (approvalData.status === 'Rejected' && !approvalData.comments.trim()) {
      setLocalError('Comments are required when rejecting a claim');
      return;
    }

    const result = await dispatch(processApproval({
      claimId: selectedClaim.claimId,
      status: approvalData.status,
      comments: approvalData.comments
    }));
    
    if (processApproval.fulfilled.match(result)) {
      setApprovalDialog(false);
      // Only refresh pending claims if not already fetching
      if (!fetchingRef.current) {
        fetchingRef.current = true;
        dispatch(fetchPendingClaims()).finally(() => {
          fetchingRef.current = false;
        });
      }
      // Trigger refresh for employee dashboard
      window.dispatchEvent(new CustomEvent('claimProcessed', { detail: { claimId: selectedClaim.claimId, status: approvalData.status } }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
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
      <Typography variant="h4" component="h1" gutterBottom sx={{
        fontSize: { xs: '1.75rem', sm: '2.125rem' },
        textAlign: { xs: 'center', sm: 'left' },
        mb: 3
      }}>
        Pending Approvals
      </Typography>
      
      {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
      
      <Grid container spacing={3}>
        {claims.map((claim) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={claim.claimId}>
            <Card>
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
                {claim.receiptImage && (
                  <Box sx={{ mb: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Image />}
                      onClick={() => {
                        const newWindow = window.open();
                        newWindow!.document.write(`<img src="${claim.receiptImage}" style="max-width:100%;height:auto;">`);
                      }}
                    >
                      View Receipt
                    </Button>
                  </Box>
                )}
                <Chip 
                  label={claim.status} 
                  color={getStatusColor(claim.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircle />}
                    fullWidth
                    onClick={() => handleApproval(claim, 'Approved')}
                    sx={{ 
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' }
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Cancel />}
                    fullWidth
                    onClick={() => handleApproval(claim, 'Rejected')}
                    sx={{ 
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' }
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    fullWidth
                    onClick={() => handleView(claim)}
                    sx={{ 
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' }
                    }}
                  >
                    View
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
            No pending approvals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All claims have been processed.
          </Typography>
        </Card>
      )}

      {/* Approval Dialog */}
      <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)} maxWidth="sm" fullWidth disableEnforceFocus disableRestoreFocus hideBackdrop>
        <DialogTitle>
          {approvalData.status === 'Approved' ? 'Approve Claim' : 'Reject Claim'}
        </DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>{selectedClaim.title}</strong> - ₹{selectedClaim.amount.toFixed(2)}
              </Typography>
              <TextField
                fullWidth
                label={approvalData.status === 'Rejected' ? 'Rejection Reason *' : 'Comments (Optional)'}
                value={approvalData.comments}
                onChange={(e) => setApprovalData({...approvalData, comments: e.target.value})}
                margin="normal"
                multiline
                rows={3}
                required={approvalData.status === 'Rejected'}
                placeholder={approvalData.status === 'Rejected' ? 'Please provide a reason for rejection...' : 'Add any comments...'}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleApprovalSubmit} 
            variant="contained"
            color={approvalData.status === 'Approved' ? 'success' : 'error'}
          >
            {approvalData.status === 'Approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
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
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Description:</strong> {selectedClaim.description}</Typography>
              
              {selectedClaim.receiptImage && (
                <Box sx={{ mt: 2 }}>
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
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PendingApprovals;