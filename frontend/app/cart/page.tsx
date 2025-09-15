'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Your Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="alert alert-info">
            Your cart is empty. <Link href="/">Continue shopping</Link>.
          </div>
        ) : (
          <>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Product</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="me-3" />
                        {item.name}
                      </div>
                    </td>
                    <td className="text-center">${item.price.toFixed(2)}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="mx-2">{item.quantity}</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="text-center">
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end align-items-center mt-4">
              <h4>Total: <span className="text-success">${getCartTotal().toFixed(2)}</span></h4>
              <Link href="/checkout" className="btn btn-primary ms-4">Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
