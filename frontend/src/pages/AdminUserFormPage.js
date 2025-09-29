import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const AdminUserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    role: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const adminUser = JSON.parse(localStorage.getItem('user'));
          const response = await axios.get(`http://localhost:5001/api/admin/users/${id}`, {
            headers: {
              Authorization: `Bearer ${adminUser.token}`,
            },
          });
          setUser(response.data);
        } catch (err) {
          setError('Failed to fetch user');
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const adminUser = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:5001/api/admin/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
        },
      });
      navigate('/admin/users');
    } catch (err) {
      setError('Failed to update user');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Edit User
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={user.username}
            InputProps={{ readOnly: true }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={user.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update User
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminUserFormPage;
