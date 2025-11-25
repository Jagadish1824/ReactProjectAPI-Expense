import { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText, InputAdornment, type SelectChangeEvent } from '@mui/material';
import { Person, Email, Lock, PersonAdd, Business } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import { type CreateUserDto, UserRole, type DepartmentDto } from '../types/User';
import { api } from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    departmentId: ''
  });
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    departmentId: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [success, setSuccess] = useState('');
  
  const validateName = (name: string) => {
    return {
      length: name.length >= 2 && name.length <= 100,
      notEmpty: name.trim() !== ''
    };
  };
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      format: emailRegex.test(email),
      notEmpty: email.trim() !== '',
      length: email.length <= 100
    };
  };
  
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
  };
  
  const nameValidation = validateName(formData.name);
  const emailValidation = validateEmail(formData.email);
  const passwordRequirements = validatePassword(formData.password);
  
  const isNameValid = Object.values(nameValidation).every(Boolean);
  const isEmailValid = Object.values(emailValidation).every(Boolean);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        console.log('Fetching departments...');
        const depts = await api.getDepartments();
        console.log('Departments received:', depts);
        setDepartments(depts);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
    if (submitted) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
    if (submitted) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Reset field errors
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', departmentId: '' };
    
    // Validate all fields
    if (!isNameValid) {
      newErrors.name = 'Name required (2-100 characters)';
    }
    
    if (!isEmailValid) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!isPasswordValid) {
      newErrors.password = 'Password: 8+ chars, uppercase, lowercase, number, special char';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.departmentId === '') {
      newErrors.departmentId = 'Please select a department';
    }
    
    // Check if there are any validation errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      setFieldErrors(newErrors);
      return;
    }

    const registerData: CreateUserDto = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: UserRole.Employee,
      departmentId: parseInt(formData.departmentId)
    };
    
    try {
      await dispatch(registerUser(registerData)).unwrap();
      setSuccess('Account created successfully! Please login.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', departmentId: '' });
      setFieldErrors({ name: '', email: '', password: '', confirmPassword: '', departmentId: '' });
      setSubmitted(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      // Parse backend validation errors
      if (err instanceof Error) {
        const errorMessage = err.message;
        if (errorMessage.includes('Email')) {
          newErrors.email = errorMessage;
        } else if (errorMessage.includes('Password')) {
          newErrors.password = errorMessage;
        } else if (errorMessage.includes('Name')) {
          newErrors.name = errorMessage;
        } else {
          // General error - show on email field as fallback
          newErrors.email = errorMessage;
        }
        setFieldErrors(newErrors);
      }
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Left Side - Image */}
      <Box sx={{
        flex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: { xs: 'none', md: 'block' },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(13, 148, 136, 0.3), rgba(20, 184, 166, 0.2))',
          zIndex: 1
        }
      }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 2,
          color: 'white',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          padding: '32px 60px',
          border: '1px solid rgba(255,255,255,0.1)',
          minWidth: '500px',
          maxWidth: '90%'
        }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Join Our Team
          </Typography>
          <Typography variant="h5" sx={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            lineHeight: 1.4,
            opacity: 0.95
          }}>
            Start managing your expenses efficiently
          </Typography>
        </Box>
      </Box>
      
      {/* Right Side - Signup Form */}
      <Box sx={{
        flex: { xs: 1, md: 0.6 },
        background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
        overflowY: 'auto',
        padding: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Card sx={{ 
          width: '100%',
          maxWidth: 420,
          margin: '20px auto',
          flexShrink: 0,
          borderRadius: 6,
          boxShadow: '0 40px 80px rgba(0,0,0,0.25), 0 20px 40px rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
          border: '2px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(25px)',
          position: 'relative',
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
          p: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.8))',
          borderRadius: '0 0 24px 24px',
          backdropFilter: 'blur(15px)',
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 20px 40px rgba(13, 148, 136, 0.4), 0 8px 25px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)',
              border: '4px solid rgba(255,255,255,0.4)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                right: '-8px',
                bottom: '-8px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, rgba(13,148,136,0.3), rgba(20,184,166,0.3), rgba(6,182,212,0.3))',
                zIndex: -1,
                filter: 'blur(8px)'
              },
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' }
              }
            }}>
              <PersonAdd sx={{ fontSize: 32, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </Box>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e293b, #0d9488)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#64748b',
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}>
              Join our expense management platform
            </Typography>
          </Box>
          
          {error && <Alert severity="error" sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { fontWeight: 500 }
          }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { fontWeight: 500 }
          }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="none"
              required
              error={!!fieldErrors.name || (formData.name !== '' && !isNameValid)}
              helperText={fieldErrors.name || (formData.name !== '' && !isNameValid ? 'Name required (2-100 characters)' : '')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#0d9488' }} />
                  </InputAdornment>
                ),
                sx: { outline: 'none', '& input': { outline: 'none' } }
              }}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  height: 48,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#0d9488'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0d9488',
                    borderWidth: 2
                  },
                  '&.Mui-focused': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  },
                  '& input': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#0d9488'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="none"
              required
              error={!!fieldErrors.email || (formData.email !== '' && !isEmailValid)}
              helperText={fieldErrors.email || (formData.email !== '' && !isEmailValid ? 'Please enter a valid email' : '')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#0d9488' }} />
                  </InputAdornment>
                ),
                sx: { outline: 'none', '& input': { outline: 'none' } }
              }}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  height: 48,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#0d9488'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0d9488',
                    borderWidth: 2
                  },
                  '&.Mui-focused': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  },
                  '& input': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#0d9488'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="none"
              required
              error={!!fieldErrors.password || (formData.password !== '' && !isPasswordValid)}
              helperText={fieldErrors.password || (formData.password !== '' && !isPasswordValid ? 'Password: 8+ chars, uppercase, lowercase, number, special char' : '')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#0d9488' }} />
                  </InputAdornment>
                ),
                sx: { outline: 'none', '& input': { outline: 'none' } }
              }}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  height: 48,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#0d9488'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0d9488',
                    borderWidth: 2
                  },
                  '&.Mui-focused': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  },
                  '& input': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#0d9488'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="none"
              required
              error={!!fieldErrors.confirmPassword || (formData.password !== formData.confirmPassword && formData.confirmPassword !== '')}
              helperText={fieldErrors.confirmPassword || (formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : '')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#0d9488' }} />
                  </InputAdornment>
                ),
                sx: { outline: 'none', '& input': { outline: 'none' } }
              }}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  height: 48,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#0d9488'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0d9488',
                    borderWidth: 2
                  },
                  '&.Mui-focused': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  },
                  '& input': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#0d9488'
                  }
                }
              }}
            />
            <FormControl fullWidth margin="none" required error={!!fieldErrors.departmentId}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  height: 48,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#0d9488'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0d9488',
                    borderWidth: 2
                  },
                  '&.Mui-focused': {
                    outline: 'none !important',
                    boxShadow: 'none !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#0d9488'
                  }
                }
              }}
            >
              <InputLabel>Department</InputLabel>
              <Select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleSelectChange}
                label="Department"
                disabled={loadingDepartments}
                startAdornment={
                  <InputAdornment position="start">
                    <Business sx={{ color: '#0d9488', ml: 1 }} />
                  </InputAdornment>
                }
              >
                {loadingDepartments ? (
                  <MenuItem disabled>Loading departments...</MenuItem>
                ) : departments.length > 0 ? (
                  departments.map((dept) => (
                    <MenuItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No departments available</MenuItem>
                )}
              </Select>
              {fieldErrors.departmentId && (
                <FormHelperText error>
                  {fieldErrors.departmentId}
                </FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                py: 1.8,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 10px 30px rgba(13, 148, 136, 0.4), 0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0f766e, #0d9488, #0891b2)',
                  boxShadow: '0 15px 40px rgba(13, 148, 136, 0.5), 0 5px 20px rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'rgba(148,163,184,0.8)',
                  color: 'white',
                  transform: 'none',
                  boxShadow: 'none'
                },
                transition: 'all 0.3s ease'
              }}
              disabled={loading || !isNameValid || !isEmailValid || !isPasswordValid || formData.password !== formData.confirmPassword || formData.departmentId === ''}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ 
                  color: '#0d9488', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      </Box>
    </Box>
  );
};

export default Signup;