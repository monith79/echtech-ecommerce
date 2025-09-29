import React from 'react';
import { Box, Typography, Container, Link as MuiLink, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import useScrollDirection from '../hooks/useScrollDirection'; // Import the custom hook

const Footer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // True for screens smaller than 'sm' breakpoint

  return (
    <Box sx={{ bgcolor: '#212121', p: 4 }} component="footer">
      <Container maxWidth="lg" sx={{ minWidth: { xs: '320px', sm: '600px' } }}>
        <Box 
          sx={{
            display: 'flex',
            flexWrap: 'wrap', // Allow items to wrap
            justifyContent: isSmallScreen ? 'center' : 'space-around', // Center on small, space-around on larger
            gap: isSmallScreen ? 2 : 3, // Smaller gap on small screens
            mb: 4,
          }}
        >
          {/* Left Column: About Section */}
          <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
            <Typography variant="h6" color="#ffffff" gutterBottom>
              About PrismTech
            </Typography>
            <Typography variant="body2" color="#bdbdbd">
              PrismTech is your premier destination for cutting-edge digital products. 
              We illuminate innovation, offering a spectrum of excellence from smart devices to advanced accessories.
            </Typography>
          </Box>

          {/* Middle Column: Address Section */}
          <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}> 
            <Typography variant="h6" color="#ffffff" gutterBottom>
              Our Address
            </Typography>
            <Typography variant="body2" color="#bdbdbd">
              Digital Avenue
            </Typography>
            <Typography variant="body2" color="#bdbdbd">
              Phnom Penh City, Phnom Penh,
            </Typography>
            <Typography variant="body2" color="#bdbdbd">
              Cambodia
            </Typography>
          </Box>

          {/* Right Column: Contact & Social Media */}
          <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
            <Typography variant="h6" color="#ffffff" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="#bdbdbd">
              Email: un.monith168@gmail.com
            </Typography>
            <Typography variant="body2" color="#bdbdbd" sx={{ mb: 1 }}>
              Phone: +855 (123) 456-789
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <IconButton color="inherit" href="#" target="_blank" aria-label="Facebook" size="medium" sx={{ color: '#ffffff' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank" aria-label="Twitter" size="medium" sx={{ color: '#ffffff' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank" aria-label="Telegram" size="medium" sx={{ color: '#ffffff' }}>
                <TelegramIcon />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank" aria-label="WhatsApp" size="medium" sx={{ color: '#ffffff' }}>
                <WhatsAppIcon />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank" aria-label="Instagram" size="medium" sx={{ color: '#ffffff' }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2" color="#bdbdbd" align="center" sx={{ mt: 4 }}>
          {'Copyright © '}
          PrismTech
          {' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
