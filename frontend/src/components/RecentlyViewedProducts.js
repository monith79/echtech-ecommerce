import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';

const RecentlyViewedProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      if (recentlyViewedIds.length > 0) {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user && user.token) {
            // Fetch details for each recently viewed product
            const productDetailsPromises = recentlyViewedIds.map(async (item) => {
              try {
                const response = await axios.get(`http://localhost:5001/api/products/${item.id}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`
                  }
                });
                return response.data;
              } catch (error) {
                console.error(`Failed to fetch product ${item.id}:`, error);
                return null; // Return null for products that failed to fetch
              }
            });
            const fetchedProducts = (await Promise.all(productDetailsPromises)).filter(Boolean); // Filter out nulls
            setRecentProducts(fetchedProducts);
          }
        } catch (error) {
          console.error('Failed to fetch recently viewed products', error);
        }
      }
    };

    fetchRecentProducts();
  }, []);

  if (recentProducts.length === 0) {
    return null; // Don't render if no recently viewed products
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Recently Viewed</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {recentProducts.map((product) => (
          <Box key={product.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <CardMedia
              component={Link}
              to={`/products/${product.id}`}
              sx={{ width: 60, height: 60, mr: 1, flexShrink: 0, objectFit: 'cover' }}
              image={product.imageUrl}
              alt={product.name}
            />
            <Box>
              <Typography variant="subtitle2" component={Link} to={`/products/${product.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${product.price}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentlyViewedProducts;
