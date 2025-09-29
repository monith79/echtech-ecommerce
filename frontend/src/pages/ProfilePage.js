import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {user && (
        <Box>
          <Typography variant="h6">Username: {user.user.username}</Typography>
          <Button variant="contained" component={Link} to="/my-orders" sx={{ mt: 2 }}>
            View My Orders
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
