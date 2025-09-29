import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          setError('Please log in to view your order details.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:5001/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }} maxWidth="md">
        <CircularProgress />
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }} maxWidth="md">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }} maxWidth="md">
        <Typography>Order not found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Order Confirmed!
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="primary">
        Thank you for your purchase!
      </Typography>
      <Box sx={{ mt: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom>
          Order #{order.id}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Total Amount: ${order.totalAmount.toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Status: {order.status}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Items:
        </Typography>
        <List>
          {order.Products && order.Products.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemText
                primary={`${item.name} (x${item.OrderProduct.quantity})`}
                secondary={`$${item.OrderProduct.price.toFixed(2)} each`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default OrderConfirmationPage;
