'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

interface User {
    username: string;
    role: string;
}

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This code runs on the client side after the component mounts
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const itemCount = getCartItemCount();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link href="/" className="navbar-brand">E-Tech</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            
            {user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text">Welcome, {user.username}</span>
                </li>
                {user.role === 'ADMIN' && (
                    <li className="nav-item">
                        <Link href="/admin" className="nav-link">Admin</Link>
                    </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link href="/cart" className="nav-link">
                Cart <span className="badge bg-secondary">{itemCount}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
