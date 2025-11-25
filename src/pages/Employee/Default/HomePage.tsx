import { Container, Typography, Card, Grid, Box, Button, Fade, Grow } from '@mui/material';
import { Receipt, Security, Speed } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { RootState } from '../../store/store';
import { UserRole } from '../../types/User';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case UserRole.Employee:
          navigate('/employee-dashboard');
          break;
        case UserRole.Manager:
          navigate('/manager-dashboard');
          break;
        case UserRole.Finance:
          navigate('/finance-dashboard');
          break;
      }
    } else {
      setShowContent(true);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.3) 0%, rgba(20, 184, 166, 0.2) 50%, rgba(6, 182, 212, 0.2) 100%)',
        zIndex: 0
      }
    }}>

      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 8, pb: 8 }}>
        <Fade in={showContent} timeout={1000}>
          <Box>
            {/* Hero Section */}
            <Box textAlign="center" sx={{ mb: 8 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '3px 3px 8px rgba(0,0,0,0.8), 1px 1px 4px rgba(0,0,0,0.9)',
                  mb: 3,
                  background: 'rgba(0,0,0,0.4)',
                  padding: '16px 32px',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)'
                }}
              >
                KANINI Expense Portal
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'white',
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px 24px',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)'
                }}
              >
                Streamline your expense management with our modern, secure platform
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    borderWidth: 2,
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      borderColor: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
            
            {/* Features Grid */}
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {[
                {
                  icon: <Speed sx={{ fontSize: 60 }} />,
                  title: 'Lightning Fast',
                  description: 'Process claims in minutes, not days. Our streamlined workflow ensures quick approvals.',
                  delay: 200
                },
                {
                  icon: <Security sx={{ fontSize: 60 }} />,
                  title: 'Bank-Level Security',
                  description: 'Your financial data is protected with enterprise-grade encryption and security.',
                  delay: 400
                },
                {
                  icon: <Receipt sx={{ fontSize: 60 }} />,
                  title: 'Smart Receipt Handling',
                  description: 'Upload receipts with ease. Our system automatically processes and categorizes.',
                  delay: 600
                }
              ].map((feature, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Grow in={showContent} timeout={1000} style={{ transitionDelay: `${feature.delay}ms` }}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      p: 4,
                      height: '100%',
                      background: 'rgba(255,255,255,0.98)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: 4,
                      border: '2px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 10px 25px rgba(13,148,136,0.2)',
                        background: 'rgba(255,255,255,1)',
                        border: '2px solid rgba(13,148,136,0.3)'
                      }
                    }}>
                      <Box sx={{ 
                        color: 'primary.main', 
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        '& svg': {
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
            
            {/* Call to Action */}
            <Fade in={showContent} timeout={1000} style={{ transitionDelay: '1400ms' }}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 6,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Ready to Transform Your Expense Management?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                  Join thousands of companies already using our platform to streamline their expense processes.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Your Journey Today
                </Button>
              </Card>
            </Fade>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage;