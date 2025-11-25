import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, IconButton, Box } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, clearError } from '../../store/departmentsSlice';
import type { Department } from '../../api';

const DepartmentManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading, error } = useSelector((state: RootState) => state.departments);
  const [dialog, setDialog] = useState({ open: false, mode: 'create' as 'create' | 'edit', department: null as Department | null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, department: null as Department | null });
  const [formData, setFormData] = useState({ departmentName: '', description: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, departments.length]);

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
    setDialog({ open: true, mode: 'create', department: null });
    setFormData({ departmentName: '', description: '' });
  };

  const handleEdit = (department: Department) => {
    setDialog({ open: true, mode: 'edit', department });
    setFormData({ departmentName: department.departmentName, description: department.description });
  };

  const handleDelete = (department: Department) => {
    setDeleteDialog({ open: true, department });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.department) return;
    
    const result = await dispatch(deleteDepartment(deleteDialog.department.departmentId));
    
    if (deleteDepartment.fulfilled.match(result)) {
      showToast('Department deleted successfully', 'success');
    } else if (deleteDepartment.rejected.match(result)) {
      const errorMessage = result.payload as string || 'Failed to delete department. It may be in use by existing users or claims.';
      showToast(errorMessage, 'error');
    }
    
    setDeleteDialog({ open: false, department: null });
  };

  const handleSubmit = async () => {
    if (!formData.departmentName.trim()) {
      showToast('Department name is required', 'error');
      return;
    }

    let result;
    if (dialog.mode === 'create') {
      result = await dispatch(createDepartment(formData));
    } else if (dialog.department) {
      result = await dispatch(updateDepartment({ id: dialog.department.departmentId, data: formData }));
    }
    
    if (result && (createDepartment.fulfilled.match(result) || updateDepartment.fulfilled.match(result))) {
      showToast(`Department ${dialog.mode === 'create' ? 'created' : 'updated'} successfully`, 'success');
      setDialog({ open: false, mode: 'create', department: null });
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
          Department Management
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
          Add Department
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={department.departmentId}>
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
                      {department.departmentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.875rem', sm: '0.875rem' },
                      lineHeight: 1.5
                    }}>
                      {department.description || 'No description'}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'row' },
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    gap: 1
                  }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(department)}
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
                      onClick={() => handleDelete(department)}
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

      {departments.length === 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            No departments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first department to get started.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Add Department
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, mode: 'create', department: null })} maxWidth="sm" fullWidth disableEnforceFocus disableRestoreFocus hideBackdrop>
        <DialogTitle>
          {dialog.mode === 'create' ? 'Create Department' : 'Edit Department'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Department Name"
            value={formData.departmentName}
            onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
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
            inputProps={{ maxLength: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, mode: 'create', department: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.departmentName.trim()}
          >
            {dialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, department: null })} disableEnforceFocus disableRestoreFocus hideBackdrop>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.department?.departmentName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, department: null })}>Cancel</Button>
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

export default DepartmentManagement;