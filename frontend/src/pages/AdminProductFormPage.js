import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    brand: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const response = await axios.get(`http://localhost:5001/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setProduct(response.data);
        } catch (err) {
          setError('Failed to fetch product');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (id) {
        await axios.put(`http://localhost:5001/api/admin/products/${id}`, product, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      } else {
        await axios.post('http://localhost:5001/api/admin/products', product, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to save product');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {id ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Product Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={product.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Condition</InputLabel>
            <Select
              name="condition"
              value={product.condition}
              label="Condition"
              onChange={handleChange}
            >
              <MenuItem value="NEW">NEW</MenuItem>
              <MenuItem value="SECONDHAND">SECONDHAND</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={product.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="Smartphone">Smartphone</MenuItem>
              <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
              <MenuItem value="Gaming">Gaming</MenuItem>
              <MenuItem value="Photography">Photography</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Brand</InputLabel>
            <Select
              name="brand"
              value={product.brand}
              label="Brand"
              onChange={handleChange}
            >
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {id ? 'Update Product' : 'Add Product'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminProductFormPage;
