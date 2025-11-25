import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Alert, Snackbar, Box } from '@mui/material';
import { Edit, Delete, Visibility, CloudUpload, Search, Add, Receipt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchUserClaims, updateClaim, deleteClaim, clearError } from '../../store/claimsSlice';
import { fetchCategories } from '../../store/categoriesSlice';
import type { ClaimDto, CreateClaimDto } from '../../types/User';

const MyClaims = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userClaims: claims, loading, error } = useSelector((state: RootState) => state.claims);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, claim: null as ClaimDto | null });
  const [selectedClaim, setSelectedClaim] = useState<ClaimDto | null>(null);
  const [editData, setEditData] = useState({
    description: '',
    categoryId: '',
    amount: '',
    expenseDate: ''
  });
  const [editErrors, setEditErrors] = useState({ amount: '' });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const filteredClaims = claims.filter(claim => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) {
      const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
      return matchesStatus;
    }
    
    const matchesSearch = (claim.title || '').toLowerCase().includes(searchLower) ||
                         (claim.categoryName || '').toLowerCase().includes(searchLower) ||
                         (claim.status || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (claims.length === 0) {
      dispatch(fetchUserClaims());
    }
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, claims.length, categories.length]);

  useEffect(() => {
    if (error) {
      setToast({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleEdit = (claim: ClaimDto) => {
    setSelectedClaim(claim);
    setEditData({
      description: claim.description,
      categoryId: claim.categoryId.toString(),
      amount: claim.amount.toString(),
      expenseDate: claim.expenseDate.split('T')[0]
    });
    setEditErrors({ amount: '' });
    setReceiptFile(null);
    setEditDialog(true);
  };

  const handleView = (claim: ClaimDto) => {
    setSelectedClaim(claim);
    setViewDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleDelete = (claim: ClaimDto) => {
    setDeleteDialog({ open: true, claim });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.claim) return;
    
    const result = await dispatch(deleteClaim(deleteDialog.claim.claimId));
    
    if (deleteClaim.fulfilled.match(result)) {
      setToast({ open: true, message: 'Claim deleted successfully', severity: 'success' });
    }
    
    setDeleteDialog({ open: false, claim: null });
  };

  const handleEditSubmit = async () => {
    if (!selectedClaim) return;
    
    const amount = parseFloat(editData.amount);
    let errorMsg = '';
    
    if (!editData.amount || amount <= 0) {
      errorMsg = 'Please enter a valid amount greater than 0';
    } else if (amount < 0.01 || amount > 999999.99) {
      errorMsg = 'Amount must be between ₹0.01 and ₹999,999.99';
    } else {
      const selectedCategory = categories.find(c => c.categoryId === parseInt(editData.categoryId));
      if (selectedCategory && selectedCategory.minAmount !== undefined && selectedCategory.maxAmount !== undefined && (amount < selectedCategory.minAmount || amount > selectedCategory.maxAmount)) {
        errorMsg = `Amount must be between ₹${selectedCategory.minAmount} and ₹${selectedCategory.maxAmount} for ${selectedCategory.categoryName} category`;
      }
    }
    
    if (errorMsg) {
      setEditErrors({ amount: errorMsg });
      return;
    }
    
    const selectedCategory = categories.find(c => c.categoryId === parseInt(editData.categoryId));
    if (selectedCategory?.categoryName?.toLowerCase() === 'others' && !editData.description.trim()) {
      setLocalError('Description is required when Others category is selected');
      return;
    }
    
    try {
      const selectedCategory = categories.find(c => c.categoryId === parseInt(editData.categoryId));
      
      const updateData: Partial<CreateClaimDto> = {
        title: selectedCategory?.categoryName || 'Expense',
        description: editData.description || `${selectedCategory?.categoryName} expense`,
        categoryId: parseInt(editData.categoryId),
        amount: amount,
        expenseDate: editData.expenseDate
      };
      
      (updateData as Partial<CreateClaimDto> & { comments: string }).comments = selectedClaim.comments || '';

      if (receiptFile) {
        updateData.receiptImage = `receipts/${receiptFile.name}`;
      } else {
        updateData.receiptImage = selectedClaim.receiptImage;
      }

      const result = await dispatch(updateClaim({ id: selectedClaim.claimId, claimData: updateData }));
      
      if (updateClaim.fulfilled.match(result)) {
        setToast({ open: true, message: 'Claim updated successfully', severity: 'success' });
        setEditDialog(false);
      }
    } catch (error: unknown) {
      setToast({ open: true, message: error instanceof Error ? error.message : 'Failed to update claim', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Paid': return 'info';
      default: return 'default';
    }
  };

  const canEdit = (status: string) => status === 'Submitted';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        Loading...
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          My Claims
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate('/create-claim')}
          sx={{ 
            minWidth: { xs: '100%', sm: 'auto' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          New Claim
        </Button>
      </Box>
          
      {localError && <Alert severity="error" sx={{ mb: 3 }}>{localError}</Alert>}
      
      <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Search claims by title, category, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1
                      }
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
                      sx={{
                        borderRadius: 1
                      }}
                    >
                      <MenuItem value="All">All Status</MenuItem>
                      <MenuItem value="Submitted">Submitted</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
      <Grid container spacing={3}>
        {filteredClaims.map((claim) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={claim.claimId}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom>
                      {claim.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {claim.categoryName}
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
                      sx={{ mb: 1 }}
                    />
                    {claim.status === 'Rejected' && (
                      <Typography variant="body2" color="error.main" sx={{ mb: 1, fontStyle: 'italic' }}>
                        {claim.comments ? `Reason: ${claim.comments}` : 'Rejection reason not available'}
                      </Typography>
                    )}
                    <Grid container spacing={1}>
                      {canEdit(claim.status) && (
                        <>
                          <Grid size={6}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Edit />}
                              fullWidth
                              onClick={() => handleEdit(claim)}
                            >
                              Edit
                            </Button>
                          </Grid>
                          <Grid size={6}>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              fullWidth
                              onClick={() => handleDelete(claim)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </>
                      )}
                      {!canEdit(claim.status) && (
                        <Grid size={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            fullWidth
                            onClick={() => handleView(claim)}
                          >
                            View Details
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredClaims.length === 0 && claims.length > 0 && (
          <Grid size={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No claims found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No claims match your search criteria.
              </Typography>
            </Card>
          </Grid>
        )}

        {claims.length === 0 && (
          <Grid size={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No claims found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You haven't submitted any expense claims yet.
              </Typography>
              <Button 
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/create-claim')}
              >
                Create Your First Claim
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)} 
        maxWidth="sm" 
        fullWidth
        disableRestoreFocus
        keepMounted={false}
      >
        <DialogTitle>Edit Claim</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Expense Category</InputLabel>
            <Select
              value={editData.categoryId}
              onChange={(e: SelectChangeEvent) => {
                const categoryId = e.target.value;
                setEditData({...editData, categoryId});
                
                if (editData.amount) {
                  const amount = parseFloat(editData.amount);
                  let errorMsg = '';
                  
                  if (amount > 0) {
                    if (amount < 0.01 || amount > 999999.99) {
                      errorMsg = 'Amount must be between ₹0.01 and ₹999,999.99';
                    } else {
                      const selectedCategory = categories.find(c => c.categoryId === parseInt(categoryId));
                      if (selectedCategory && selectedCategory.minAmount !== undefined && selectedCategory.maxAmount !== undefined && (amount < selectedCategory.minAmount || amount > selectedCategory.maxAmount)) {
                        errorMsg = `Amount must be between ₹${selectedCategory.minAmount} and ₹${selectedCategory.maxAmount} for ${selectedCategory.categoryName} category`;
                      }
                    }
                  }
                  
                  setEditErrors({ amount: errorMsg });
                }
              }}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={editData.amount}
            onChange={(e) => {
              const value = e.target.value;
              setEditData({...editData, amount: value});
              
              const amount = parseFloat(value);
              let errorMsg = '';
              
              if (value && amount > 0) {
                if (amount < 0.01 || amount > 999999.99) {
                  errorMsg = 'Amount must be between ₹0.01 and ₹999,999.99';
                } else if (editData.categoryId) {
                  const selectedCategory = categories.find(c => c.categoryId === parseInt(editData.categoryId));
                  if (selectedCategory && selectedCategory.minAmount !== undefined && selectedCategory.maxAmount !== undefined && (amount < selectedCategory.minAmount || amount > selectedCategory.maxAmount)) {
                    errorMsg = `Amount must be between ₹${selectedCategory.minAmount} and ₹${selectedCategory.maxAmount} for ${selectedCategory.categoryName} category`;
                  }
                }
              }
              
              setEditErrors({ amount: errorMsg });
            }}
            margin="normal"
            inputProps={{ 
              step: "0.01", 
              min: "0.01",
              max: "999999.99" 
            }}
            error={!!editErrors.amount}
            helperText={editErrors.amount || (editData.categoryId ? 
              (() => {
                const selectedCategory = categories.find(c => c.categoryId === parseInt(editData.categoryId));
                if (selectedCategory) {
                  return `For ${selectedCategory.categoryName}: Enter amount between ₹${selectedCategory.minAmount} - ₹${selectedCategory.maxAmount}`;
                }
                return 'Enter amount between ₹0.01 - ₹999,999.99';
              })() :
              'Enter amount between ₹0.01 - ₹999,999.99'
            )}
          />
          <TextField
            fullWidth
            label="Expense Date"
            type="date"
            value={editData.expenseDate}
            onChange={(e) => setEditData({...editData, expenseDate: e.target.value})}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
              min: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]
            }}
          />
          <TextField
            fullWidth
            label={categories.find(c => c.categoryId === parseInt(editData.categoryId))?.categoryName?.toLowerCase() === 'others' ? 'Description *' : 'Description (Optional)'}
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            margin="normal"
            multiline
            rows={2}
            placeholder="Additional details about this expense..."
            required={categories.find(c => c.categoryId === parseInt(editData.categoryId))?.categoryName?.toLowerCase() === 'others'}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Receipt Image (Optional)</Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ height: 56, justifyContent: 'flex-start' }}
            >
              {receiptFile ? receiptFile.name : 'Upload Receipt Image'}
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', display: 'block' }}>
              Supported formats: JPG, JPEG, PNG, GIF, BMP, WEBP
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)} 
        maxWidth="sm" 
        fullWidth
        disableRestoreFocus
        keepMounted={false}
      >
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <>
              <TextField
                fullWidth
                label="Title"
                value={selectedClaim.title}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedClaim.description}
                margin="normal"
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Category"
                value={selectedClaim.categoryName}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Amount"
                value={`₹${selectedClaim.amount.toFixed(2)}`}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Expense Date"
                value={new Date(selectedClaim.expenseDate).toLocaleDateString()}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Status"
                value={selectedClaim.status}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              {selectedClaim.status === 'Rejected' && (
                <TextField
                  fullWidth
                  label="Rejection Reason"
                  value={selectedClaim.comments || 'Rejection reason not available'}
                  margin="normal"
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiInputBase-input': { color: 'error.main' } }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, claim: null })}
        disableRestoreFocus
        keepMounted={false}
      >
        <DialogTitle>Delete Claim</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.claim?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, claim: null })}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
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

export default MyClaims;