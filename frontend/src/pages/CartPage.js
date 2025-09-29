import React from 'react';
import { useCart } from '../hooks/useCart';
import { Container, Typography, List, ListItem, ListItemText, Button, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }} />
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.price.toFixed(2)}`}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    type="number"
                    label="Qty"
                    variant="outlined"
                    size="small"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    sx={{ width: 70, mr: 1 }}
                    inputProps={{ min: 1 }}
                  />
                  <Button onClick={() => removeFromCart(item.id)}>Remove</Button>
                </Box>
              </ListItem>
            ))}
          </List>
          <Typography variant="h5" sx={{ mt: 3, textAlign: 'right' }}>
            Total: ${calculateTotal()}
          </Typography>
          <Button component={Link} to="/checkout" variant="contained" sx={{ mt: 2 }}>
            Checkout
          </Button>
        </>
      )}
    </Container>
  );
};

export default CartPage;
