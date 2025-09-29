import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  // Sample data for featured categories and products
  const featuredCategories = [
    {
      name: 'Smartphones',
      imageUrl: 'https://placehold.co/400x200/2d3748/ffffff?text=Smartphones',
      link: '/products?category=Smartphone',
    },
    {
      name: 'Laptops',
      imageUrl: 'https://placehold.co/400x200/2d3748/ffffff?text=Laptops',
      link: '/products?category=Laptop',
    },
    {
      name: 'Cameras',
      imageUrl: 'https://placehold.co/400x200/2d3748/ffffff?text=Cameras',
      link: '/products?category=Photography',
    },
    {
      name: 'Accessories',
      imageUrl: 'https://placehold.co/400x200/2d3748/ffffff?text=Accessories',
      link: '/products?category=Audio', // Example, can be more specific
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Smartphone Pro X',
      description: 'The latest and greatest smartphone with a stunning display and amazing camera.',
      price: 999.99,
      imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Smartphone',
    },
    {
      id: 7,
      name: 'Mirrorless Camera Z',
      description: 'Professional-grade mirrorless camera with 4K video and a full-frame sensor.',
      price: 1999.99,
      imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Camera',
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      description: 'Noise-cancelling headphones with superior sound quality.',
      price: 199.99,
      imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Headphones',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          backgroundImage: 'url(https://placehold.co/1200x400/4A90E2/ffffff?text=Welcome+to+PrismTech)', // Placeholder background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to PrismTech
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            Your Gateway to Digital Excellence
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/products">
            Shop All Products
          </Button>
        </Container>
      </Box>

      {/* Featured Categories Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Explore Our Categories
        </Typography>
        <Grid container spacing={4}>
          {featuredCategories.map((category) => (
            <Grid item key={category.name} xs={12} sm={6} md={3}>
              <Card component={Link} to={category.link} sx={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={category.imageUrl}
                  alt={category.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" textAlign="center">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Our Top Picks
        </Typography>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6">
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomePage;
