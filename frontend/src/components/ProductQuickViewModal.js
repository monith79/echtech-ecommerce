import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, CardMedia, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../hooks/useCart';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const ProductQuickViewModal = ({ product, open, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    onClose(); // Close modal after adding to cart
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-quick-view-title"
      aria-describedby="product-quick-view-description"
    >
      <Box sx={style}>
        <IconButton 
          onClick={onClose} 
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="product-quick-view-title" variant="h5" component="h2" gutterBottom>
          {product.name}
        </Typography>
        <CardMedia
          component="img"
          image={product.imageUrl}
          alt={product.name}
          sx={{ height: 250, objectFit: 'contain', mb: 2 }}
        />
        <Typography id="product-quick-view-description" sx={{ mt: 2, mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            type="number"
            label="Qty"
            variant="outlined"
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            sx={{ width: 70, mr: 1 }}
            inputProps={{ min: 1 }}
          />
          <Button variant="contained" onClick={handleAddToCart} sx={{ flexGrow: 1 }}>
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductQuickViewModal;