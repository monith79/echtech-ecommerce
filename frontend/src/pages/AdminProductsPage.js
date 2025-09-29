import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:5001/api/products', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`http://localhost:5001/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      <Button variant="contained" component={Link} to="/admin/products/new" sx={{ mb: 2 }}>Add New Product</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small" component={Link} to={`/admin/products/edit/${product.id}`} sx={{ mr: 1 }}>Edit</Button>
                <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(product.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminProductsPage;
