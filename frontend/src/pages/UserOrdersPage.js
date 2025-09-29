import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
          const response = await axios.get('http://localhost:5001/api/orders', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user orders', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography>You have not placed any orders yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
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
      )}
    </Container>
  );
};

export default UserOrdersPage;
