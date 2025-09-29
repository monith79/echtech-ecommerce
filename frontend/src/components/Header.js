import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../hooks/useCart';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart(); // Use the useCart hook

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed"> 
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          PrismTech
        </Typography>
        
        {/* Cart Button with Badge */}
        <IconButton color="inherit" component={Link} to="/cart" aria-label="cart">
          <Badge badgeContent={totalCartItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {user && user.user.role === 'ADMIN' && (
          <Button color="inherit" component={Link} to="/admin">Admin</Button>
        )}
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
