import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:5001/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.User ? order.User.username : 'N/A'}</TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {
                  order.Products && order.Products.map(product => (
                    <div key={product.id}>
                      {product.name} (x{product.OrderProduct.quantity}) - ${product.OrderProduct.price}
                    </div>
                  ))
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminOrdersPage;
