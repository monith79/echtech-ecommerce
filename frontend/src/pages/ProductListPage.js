import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Box, Paper, Button, Slider } from '@mui/material';
import { useCart } from '../hooks/useCart';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]); // Default price range
  const [sortBy, setSortBy] = useState('nameAsc'); // Default sort by name ascending
  const [quantities, setQuantities] = useState({}); // State to manage quantities for each product
  const { addToCart } = useCart();

  // Sample data for Featured/Newest Products
  const featuredProducts = [
    {
      id: 1,
      name: 'Smartphone Pro X',
      imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Smartphone',
      price: 999.99,
    },
    {
      id: 7,
      name: 'Mirrorless Camera Z',
      imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Camera',
      price: 1999.99,
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Headphones',
      price: 199.99,
    },
    {
      id: 12, // New ID for the accessory
      name: 'PrismTech Universal Charging Hub',
      imageUrl: 'https://placehold.co/600x400/FFD700/000000?text=Charging+Hub',
      price: 49.99,
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
          const params = {};
          if (searchTerm) params.search = searchTerm;
          if (category) params.category = category;
          if (brand) params.brand = brand;
          if (condition) params.condition = condition;
          params.minPrice = priceRange[0];
          params.maxPrice = priceRange[1];
          params.sortBy = sortBy;

          const response = await axios.get('http://localhost:5001/api/products', {
            headers: {
              Authorization: `Bearer ${user.token}`
            },
            params
          });
          setProducts(response.data);
          // Initialize quantities for new products
          const initialQuantities = {};
          response.data.forEach(product => {
            initialQuantities[product.id] = 1;
          });
          setQuantities(initialQuantities);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, [searchTerm, category, brand, condition, priceRange, sortBy]);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, Number(value)), // Ensure quantity is at least 1
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Box 
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' }, // Stack columns on small screens
        }}
      >
        {/* Left Column: Filters */}
        <Box 
          sx={{
            flex: { xs: '1 1 100%', md: '0 0 250px' }, // Full width on xs, fixed on md
            position: { md: 'sticky' }, // Sticky only on medium and larger screens
            top: { md: 84 }, // Adjust top position for sticky
          }}
        >
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <TextField
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Smartphone">Smartphone</MenuItem>
                <MenuItem value="Laptop">Laptop</MenuItem>
                <MenuItem value="Audio">Audio</MenuItem>
                <MenuItem value="Gaming">Gaming</MenuItem>
                <MenuItem value="Photography">Photography</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Brand</InputLabel>
              <Select
                value={brand}
                label="Brand"
                onChange={(e) => setBrand(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Apple">Apple</MenuItem>
                <MenuItem value="Dell">Dell</MenuItem>
                <MenuItem value="Sony">Sony</MenuItem>
                <MenuItem value="MSI">MSI</MenuItem>
                <MenuItem value="Samsung">Samsung</MenuItem>
                <MenuItem value="HP">HP</MenuItem>
                <MenuItem value="Nikon">Nikon</MenuItem>
                <MenuItem value="Canon">Canon</MenuItem>
                <MenuItem value="GoPro">GoPro</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Condition</InputLabel>
              <Select
                value={condition}
                label="Condition"
                onChange={(e) => setCondition(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="SECONDHAND">Secondhand</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ${priceRange[0]} - ${priceRange[1]}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={handleSortByChange}
              >
                <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
                <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
                <MenuItem value="priceAsc">Price (Low to High)</MenuItem>
                <MenuItem value="priceDesc">Price (High to Low)</MenuItem>
              </Select>
            </FormControl>

          </Paper>
        </Box>

        {/* Center Column: Main Product Listings */}
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '400px' } }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>All Products</Typography>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} sx={{ width: '220px' }}> {/* Fixed width for card container */}
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 480 }} 
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
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h2" 
                        sx={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }} 
                      >
                        {product.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{
                          mb: 1, 
                          maxHeight: 40, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }} 
                      >
                        {product.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Condition: {product.condition}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Brand: {product.brand}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 'auto' }}>
                      ${product.price}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TextField
                        type="number"
                        label="Qty"
                        variant="outlined"
                        size="medium" // Changed size to medium
                        value={quantities[product.id] || 1}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        sx={{ width: 70, mr: 1 }} // Adjusted width and margin
                        inputProps={{ min: 1 }}
                      />
                      <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ mt: 2, ml: 1 }} 
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Right Column: Featured/Newest Products */}
        <Box 
          sx={{
            flex: { xs: '1 1 100%', md: '0 0 250px' }, // Full width on xs, fixed on md
            position: 'sticky', 
            top: 84, 
            width: { xs: '100%', md: '250px' }, // Full width on small screens
          }}
        >
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Featured Products</Typography>
            {featuredProducts.map((product) => (
              <Box key={product.id} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
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
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductListPage;
