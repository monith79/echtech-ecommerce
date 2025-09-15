'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process payment here.
    console.log('Placing order...');
    clearCart();
    router.push('/order-success');
  };

  if (cartItems.length === 0) {
    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="alert alert-warning">Your cart is empty. You cannot proceed to checkout.</div>
            </div>
        </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Checkout</h2>
        <div className="row">
          {/* Shipping Details Form */}
          <div className="col-md-7">
            <h4>Shipping Details</h4>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="fullName" required />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" required />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input type="text" className="form-control" id="city" required />
              </div>
              <div className="mb-3">
                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                <input type="text" className="form-control" id="postalCode" required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100">Place Order</button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="col-md-5">
            <h4>Order Summary</h4>
            <ul className="list-group mb-3">
              {cartItems.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  </div>
                  <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
