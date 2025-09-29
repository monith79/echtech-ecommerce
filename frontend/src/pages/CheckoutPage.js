import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        alert('Please log in to place an order.');
        navigate('/login');
        return;
      }

      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity, 
      }));

      const response = await axios.post('http://localhost:5001/api/orders', { items: orderItems }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      clearCart();
      navigate(`/order-confirmation/${response.data.orderId}`); // Navigate to confirmation page
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Box component="form" onSubmit={handleCheckout} noValidate autoComplete="off">
          <TextField required id="fullName" label="Full Name" fullWidth margin="normal" value={formData.fullName} onChange={handleChange} />
          <TextField required id="address" label="Address" fullWidth margin="normal" value={formData.address} onChange={handleChange} />
          <TextField required id="city" label="City" fullWidth margin="normal" value={formData.city} onChange={handleChange} />
          <TextField required id="state" label="State" fullWidth margin="normal" value={formData.state} onChange={handleChange} />
          <TextField required id="zip" label="Zip Code" fullWidth margin="normal" value={formData.zip} onChange={handleChange} />
          <TextField required id="cardName" label="Name on Card" fullWidth margin="normal" value={formData.cardName} onChange={handleChange} />
          <TextField required id="cardNumber" label="Card Number" fullWidth margin="normal" value={formData.cardNumber} onChange={handleChange} />
          <TextField required id="expDate" label="Expiration Date" fullWidth margin="normal" value={formData.expDate} onChange={handleChange} />
          <TextField required id="cvv" label="CVV" fullWidth margin="normal" value={formData.cvv} onChange={handleChange} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Place Order
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CheckoutPage;
