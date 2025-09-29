import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import { Container, Typography, Card, CardMedia, CardContent, Button, TextField, Box } from '@mui/material';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
          const response = await axios.get(`http://localhost:5001/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setProduct(response.data);

          // Add product to recently viewed
          let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
          // Remove if already exists to move it to the front
          recentlyViewed = recentlyViewed.filter(item => item.id !== response.data.id);
          // Add to front, limit to 5 items
          recentlyViewed.unshift({ id: response.data.id, name: response.data.name, imageUrl: response.data.imageUrl, price: response.data.price });
          localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.slice(0, 5)));
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Card>
        <CardMedia
          component="img"
          sx={{
            // 16:9
            pt: '56.25%',
          }}
          image={product.imageUrl}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="h6">
            ${product.price}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              type="number"
              label="Qty"
              variant="outlined"
              size="medium" // Changed size to medium
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              sx={{ width: 70, mr: 1 }} // Adjusted width and margin
              inputProps={{ min: 1 }}
            />
            <Button variant="contained" onClick={handleAddToCart} sx={{ flexGrow: 1, ml: 1 }}>Add to Cart</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetailPage;