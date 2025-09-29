import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';

const ProductSummaryPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
          // Fetch a limited number of products or specific featured ones
          const response = await axios.get('http://localhost:5001/api/products?limit=8', { // Example: limit to 8 products
            headers: {
              Authorization: `Bearer ${user.token}`
            },
          });
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products for summary', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component={Link}
                to={`/products/${product.id}`}
                sx={{ 
                  height: 180, 
                  objectFit: 'cover',
                }}
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description.substring(0, 100)}...
                </Typography>
                <Typography variant="h6">
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button variant="contained" size="large" component={Link} to="/products">
          View All Products
        </Button>
      </Box>
    </Container>
  );
};

export default ProductSummaryPage;
