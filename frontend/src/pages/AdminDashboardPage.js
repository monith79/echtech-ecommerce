import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const AdminDashboardPage = () => {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ '& button': { m: 1 } }}>
        <Button variant="contained" component={Link} to="/admin/products">
          Manage Products
        </Button>
        <Button variant="contained" component={Link} to="/admin/users">
          Manage Users
        </Button>
        <Button variant="contained" component={Link} to="/admin/orders">
          Manage Orders
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
