import { Box, Typography, Grid, Link, Container, Divider } from '@mui/material';
import { Email, Phone, LocationOn, GitHub, LinkedIn, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      py: 2,
      mt: 'auto',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
      }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(254, 107, 139, 0.3)'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                  E
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                Expense Portal
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ 
              opacity: 0.9, 
              lineHeight: 1.5,
              mb: 1.5
            }}>
              Streamlining expense management with modern technology and intuitive design for businesses of all sizes.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <GitHub sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <LinkedIn sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Twitter sx={{ fontSize: 20 }} />
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Email sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                support@expenseportal.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Phone sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                +91 9876543210
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <LocationOn sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Kanini Software Solutions, Bengaluru
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Help Center
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Documentation
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ 
          my: 1.5, 
          borderColor: 'rgba(255,255,255,0.2)',
          '&::before, &::after': {
            borderColor: 'rgba(255,255,255,0.2)'
          }
        }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 Expense Portal. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Made with ❤️ for efficient expense management
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;