import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:5001/api/admin/users', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`http://localhost:5001/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small" component={Link} to={`/admin/users/edit/${user.id}`} sx={{ mr: 1 }}>Edit</Button>
                <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminUsersPage;
