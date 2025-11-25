import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, TextField, Button, Typography, Box, Alert, MenuItem, Select, FormControl, InputLabel, type SelectChangeEvent, Snackbar } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { createClaim, clearError } from '../../store/claimsSlice';
import { fetchCategories } from '../../store/categoriesSlice';
import type { CreateClaimDto } from '../../types/User';

const CreateClaim = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { loading: claimsLoading, error: claimsError } = useSelector((state: RootState) => state.claims);
  
  const [formData, setFormData] = useState({
    description: '',
    categoryId: '',
    amount: '',
    expenseDate: ''
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
    receipt: ''
  });

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();
  const loading = claimsLoading;
  
  const validateExpenseDate = (date: string) => {
    if (!date) return { valid: false, message: 'Expense date is required' };
    
    const selectedDate = new Date(date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Set time to start of day for accurate comparison
    today.setHours(23, 59, 59, 999);
    oneYearAgo.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return { valid: false, message: 'Expense date cannot be in the future' };
    }
    
    if (selectedDate < oneYearAgo) {
      return { valid: false, message: 'Expense date cannot be more than 1 year old' };
    }
    
    return { valid: true, message: '' };
  };
  
  const dateValidation = validateExpenseDate(formData.expenseDate);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (claimsError) {
      setToast({ open: true, message: claimsError, severity: 'error' });
      dispatch(clearError());
    }
  }, [claimsError, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error
    const newErrors = { ...fieldErrors, [name]: '' };
    
    // Validate amount
    if (name === 'amount' && value) {
      const amount = parseFloat(value);
      
      if (amount < 0.01) {
        newErrors.amount = 'Amount must be at least ₹0.01';
      } else if (amount > 999999.99) {
        newErrors.amount = 'Amount cannot exceed ₹999,999.99';
      } else if (formData.categoryId) {
        // Validate amount against category range
        const selectedCategory = categories.find(c => c.categoryId === parseInt(formData.categoryId));
        
        if (selectedCategory && selectedCategory.minAmount !== undefined && amount < selectedCategory.minAmount) {
          newErrors.amount = `Amount must be at least ₹${selectedCategory.minAmount} for ${selectedCategory.categoryName} category`;
        } else if (selectedCategory && selectedCategory.maxAmount !== undefined && amount > selectedCategory.maxAmount) {
          newErrors.amount = `Amount cannot exceed ₹${selectedCategory.maxAmount} for ${selectedCategory.categoryName} category`;
        }
      }
    }
    
    setFieldErrors(newErrors);
  };

  const validateImageFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return { valid: false, message: 'Only image files are allowed (jpg, jpeg, png, gif, bmp, webp)' };
    }
    
    return { valid: true, message: '' };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setFieldErrors({ ...fieldErrors, receipt: validation.message });
        e.target.value = ''; // Clear the input
        return;
      }
      setReceiptFile(file);
      setFieldErrors({ ...fieldErrors, receipt: '' });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear category error
    const newErrors = { ...fieldErrors, category: '' };
    
    // Validate current amount against new category limit
    if (name === 'categoryId' && formData.amount) {
      const selectedCategory = categories.find(c => c.categoryId === parseInt(value));
      const amount = parseFloat(formData.amount);
      
      if (amount < 0.01) {
        newErrors.amount = 'Amount must be at least ₹0.01';
      } else if (amount > 999999.99) {
        newErrors.amount = 'Amount cannot exceed ₹999,999.99';
      } else if (selectedCategory && selectedCategory.minAmount !== undefined && amount < selectedCategory.minAmount) {
        newErrors.amount = `Amount must be at least ₹${selectedCategory.minAmount} for ${selectedCategory.categoryName} category`;
      } else if (selectedCategory && selectedCategory.maxAmount !== undefined && amount > selectedCategory.maxAmount) {
        newErrors.amount = `Amount cannot exceed ₹${selectedCategory.maxAmount} for ${selectedCategory.categoryName} category`;
      } else {
        newErrors.amount = '';
      }
    }
    
    setFieldErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset field errors
    const newErrors = { category: '', amount: '', date: '', description: '', receipt: '' };

    try {
      // Validate required fields
      if (!formData.categoryId) {
        newErrors.category = 'Please select an expense category';
      }
      
      const amount = parseFloat(formData.amount);
      if (!formData.amount || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount greater than 0';
      } else if (amount < 0.01) {
        newErrors.amount = 'Amount must be at least ₹0.01';
      } else if (amount > 999999.99) {
        newErrors.amount = 'Amount cannot exceed ₹999,999.99';
      } else {
        // Validate amount against category range
        const selectedCategory = categories.find(c => c.categoryId === parseInt(formData.categoryId));
        
        if (selectedCategory && selectedCategory.minAmount !== undefined && amount < selectedCategory.minAmount) {
          newErrors.amount = `Amount must be at least ₹${selectedCategory.minAmount} for ${selectedCategory.categoryName} category`;
        } else if (selectedCategory && selectedCategory.maxAmount !== undefined && amount > selectedCategory.maxAmount) {
          newErrors.amount = `Amount cannot exceed ₹${selectedCategory.maxAmount} for ${selectedCategory.categoryName} category`;
        }
      }
      
      if (!formData.expenseDate) {
        newErrors.date = 'Please select an expense date';
      }
      
      if (!receiptFile) {
        newErrors.receipt = 'Please upload a receipt image';
      }
      
      // If there are validation errors, show them and return
      if (newErrors.category || newErrors.amount || newErrors.date || newErrors.receipt) {
        setFieldErrors(newErrors);
        return;
      }

      const selectedCategory = categories.find(c => c.categoryId === parseInt(formData.categoryId));
      
      // Check if Others category is selected and description is empty
      if (selectedCategory?.categoryName?.toLowerCase() === 'others' && !formData.description.trim()) {
        newErrors.description = 'Description is required when Others category is selected';
        setFieldErrors(newErrors);
        return;
      }
      
      // Validate expense date
      if (!dateValidation.valid) {
        newErrors.date = dateValidation.message;
        setFieldErrors(newErrors);
        return;
      }
      
  
      const claimData: CreateClaimDto = {
        title: selectedCategory?.categoryName || 'Expense',
        description: formData.description || `${selectedCategory?.categoryName} expense`,
        categoryId: parseInt(formData.categoryId),
        amount: parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        receiptImage: `receipts/${receiptFile?.name || 'receipt'}` // Simulate uploaded file path
      };
      
      // Add empty comments field to avoid backend validation error
      (claimData as CreateClaimDto & { comments: string }).comments = '';

      const result = await dispatch(createClaim(claimData));
      
      if (createClaim.fulfilled.match(result)) {
        setToast({ open: true, message: 'Claim submitted successfully!', severity: 'success' });
        setFormData({
          description: '',
          categoryId: '',
          amount: '',
          expenseDate: ''
        });
        setReceiptFile(null);
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('claimCreated'));
        
        setTimeout(() => navigate('/employee-dashboard'), 2000);
      }

    } catch (error: unknown) {
      // Handle general submission errors
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit claim';
      setToast({ open: true, message: errorMessage, severity: 'error' });
      newErrors.receipt = errorMessage; // Show general error on receipt field as fallback
      setFieldErrors(newErrors);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        zIndex: 0
      }
    }}>
      <Card sx={{ 
        width: '100%',
        maxWidth: 600,
        borderRadius: 6,
        boxShadow: '0 40px 80px rgba(0,0,0,0.25), 0 20px 40px rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.7)',
        border: '2px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(25px)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0d9488, #14b8a6, #06b6d4, #0d9488)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite'
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        transform: 'perspective(1000px) rotateX(2deg)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'perspective(1000px) rotateX(0deg) translateY(-5px)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.3), 0 25px 50px rgba(13,148,136,0.2), inset 0 1px 0 rgba(255,255,255,0.4)'
        }
      }}>
          <CardContent sx={{ 
            p: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))',
            borderRadius: '0 0 16px 16px',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, #0d9488, #14b8a6)',
              borderRadius: '0 0 4px 4px'
            }
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              textAlign="center"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e293b, #0d9488)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                mt: 2
              }}
            >
              Create Expense Claim
            </Typography>
            

            
            <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={!!fieldErrors.category}>
              <InputLabel>Expense Category*</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleSelectChange}
                label="Expense Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {fieldErrors.category}
                </Typography>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
              inputProps={{ 
                step: "0.01", 
                min: formData.categoryId ? 
                  Math.max(categories.find(c => c.categoryId === parseInt(formData.categoryId))?.minAmount ?? 0.01, 0.01).toString() : 
                  "0.01",
                max: formData.categoryId ? 
                  Math.min(categories.find(c => c.categoryId === parseInt(formData.categoryId))?.maxAmount ?? 999999.99, 999999.99).toString() : 
                  "999999.99" 
              }}
              required
              error={!!fieldErrors.amount}
              helperText={
                fieldErrors.amount || 
                (formData.categoryId ? 
                  (() => {
                    const selectedCategory = categories.find(c => c.categoryId === parseInt(formData.categoryId));
                    if (selectedCategory) {
                      return `For ${selectedCategory.categoryName}: Enter amount between ₹${selectedCategory.minAmount} - ₹${selectedCategory.maxAmount}`;
                    }
                    return '';
                  })() :
                  ''
                )
              }
            />
            
            <TextField
              fullWidth
              label="Expense Date"
              name="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              error={!!fieldErrors.date || (formData.expenseDate !== '' && !dateValidation.valid)}
              helperText={fieldErrors.date || (formData.expenseDate !== '' && !dateValidation.valid ? dateValidation.message : 'Select the date when the expense occurred')}
              inputProps={{
                max: new Date().toISOString().split('T')[0], // Prevent future dates in date picker
                min: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0] // Prevent dates older than 1 year
              }}
            />
            
            <TextField
              fullWidth
              label={categories.find(c => c.categoryId === parseInt(formData.categoryId))?.categoryName?.toLowerCase() === 'others' ? 'Description *' : 'Description (Optional)'}
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
              placeholder="Additional details about this expense..."
              required={categories.find(c => c.categoryId === parseInt(formData.categoryId))?.categoryName?.toLowerCase() === 'others'}
              error={!!fieldErrors.description}
              helperText={fieldErrors.description}
            />

            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Receipt Image *</Typography>
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
              {fieldErrors.receipt ? (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {fieldErrors.receipt}
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', display: 'block' }}>
                  Supported formats: JPG, JPEG, PNG, GIF, BMP, WEBP
                </Typography>
              )}
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/employee-dashboard')}
            >
              Cancel
            </Button>
            </Box>
          </CardContent>
        </Card>

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
    </Box>
  );
};

export default CreateClaim;