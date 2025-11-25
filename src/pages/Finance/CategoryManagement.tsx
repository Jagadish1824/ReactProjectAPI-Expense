import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, IconButton, Box } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchCategories, createCategory, updateCategory, deleteCategory, clearError } from '../../store/categoriesSlice';
import type { Category } from '../../api';

const CategoryManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);
  const [dialog, setDialog] = useState({ open: false, mode: 'create' as 'create' | 'edit', category: null as Category | null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null as Category | null });
  const [formData, setFormData] = useState({ categoryName: '', description: '', minAmount: '', maxAmount: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const handleCreate = () => {
    setDialog({ open: true, mode: 'create', category: null });
    setFormData({ categoryName: '', description: '', minAmount: '', maxAmount: '' });
  };

  const handleEdit = (category: Category) => {
    setDialog({ open: true, mode: 'edit', category });
    setFormData({ 
      categoryName: category.categoryName, 
      description: category.description,
      minAmount: category.minAmount?.toString() || '',
      maxAmount: category.maxAmount?.toString() || ''
    });
  };

  const handleDelete = (category: Category) => {
    setDeleteDialog({ open: true, category });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.category) return;
    
    const result = await dispatch(deleteCategory(deleteDialog.category.categoryId));
    
    if (deleteCategory.fulfilled.match(result)) {
      showToast('Category deleted successfully', 'success');
    }
    
    setDeleteDialog({ open: false, category: null });
  };

  const handleSubmit = async () => {
    if (!formData.categoryName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Description is required', 'error');
      return;
    }
    if (!formData.minAmount || parseFloat(formData.minAmount) < 0.01) {
      showToast('Minimum amount must be at least 0.01', 'error');
      return;
    }
    if (!formData.maxAmount || parseFloat(formData.maxAmount) < 0.01) {
      showToast('Maximum amount must be at least 0.01', 'error');
      return;
    }
    if (parseFloat(formData.minAmount) >= parseFloat(formData.maxAmount)) {
      showToast('Maximum amount must be greater than minimum amount', 'error');
      return;
    }

    const requestData = {
      CategoryName: formData.categoryName,
      Description: formData.description,
      MinAmount: parseFloat(formData.minAmount) || 0.01,
      MaxAmount: parseFloat(formData.maxAmount) || 999999.99
    };
    
    let result;
    if (dialog.mode === 'create') {
      result = await dispatch(createCategory(requestData));
    } else if (dialog.category) {
      result = await dispatch(updateCategory({ id: dialog.category.categoryId, data: requestData }));
    }
    
    if (result && (createCategory.fulfilled.match(result) || updateCategory.fulfilled.match(result))) {
      showToast(`Category ${dialog.mode === 'create' ? 'created' : 'updated'} successfully`, 'success');
      setDialog({ open: false, mode: 'create', category: null });
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
          Category Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ 
            minWidth: { xs: '100%', sm: 'auto' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Add Category
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.categoryId}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                  alignItems: { xs: 'stretch', sm: 'flex-start' }
                }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      {category.categoryName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.875rem', sm: '0.875rem' },
                      lineHeight: 1.5
                    }}>
                      {category.description || 'No description'}
                    </Typography>
                    {category.minAmount && category.maxAmount && (
                      <Typography variant="body2" color="primary.main" sx={{ mt: 1, fontWeight: 500 }}>
                        Range: ₹{category.minAmount} - ₹{category.maxAmount}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'row' },
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    gap: 1
                  }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(category)}
                      sx={{ 
                        minWidth: { xs: 44, sm: 'auto' },
                        minHeight: { xs: 44, sm: 'auto' }
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(category)}
                      sx={{ 
                        minWidth: { xs: 44, sm: 'auto' },
                        minHeight: { xs: 44, sm: 'auto' }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {categories.length === 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first expense category to get started.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Add Category
          </Button>
        </Card>
      )}

      <Dialog 
        open={dialog.open} 
        onClose={() => setDialog({ open: false, mode: 'create', category: null })} 
        maxWidth="sm" 
        fullWidth
        disableRestoreFocus
        keepMounted={false}
        PaperProps={{
          sx: {
            m: { xs: 2, sm: 3 },
            width: { xs: 'calc(100% - 32px)', sm: 'auto' },
            maxHeight: { xs: 'calc(100vh - 64px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle>
          {dialog.mode === 'create' ? 'Create Category' : 'Edit Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.categoryName}
            onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
            margin="normal"
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            margin="normal"
            multiline
            rows={3}
            required
            inputProps={{ maxLength: 500 }}
          />
          <TextField
            fullWidth
            label="Minimum Amount"
            type="number"
            value={formData.minAmount}
            onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
            margin="normal"
            required
            inputProps={{ min: "0.01", max: "999999.99", step: "0.01" }}
            helperText="Minimum allowed amount (0.01 - 999,999.99)"
          />
          <TextField
            fullWidth
            label="Maximum Amount"
            type="number"
            value={formData.maxAmount}
            onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
            margin="normal"
            required
            inputProps={{ min: "0.01", max: "999999.99", step: "0.01" }}
            helperText="Maximum allowed amount (0.01 - 999,999.99)"
          />
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          p: { xs: 2, sm: 3 }
        }}>
          <Button 
            onClick={() => setDialog({ open: false, mode: 'create', category: null })}
            sx={{ 
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.categoryName.trim() || !formData.description.trim() || !formData.minAmount || !formData.maxAmount}
            sx={{ 
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {dialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, category: null })}
        disableRestoreFocus
        keepMounted={false}
        PaperProps={{
          sx: {
            m: { xs: 2, sm: 3 },
            width: { xs: 'calc(100% - 32px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.category?.categoryName}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          p: { xs: 2, sm: 3 }
        }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, category: null })}
            sx={{ 
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Delete
          </Button>
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

export default CategoryManagement;