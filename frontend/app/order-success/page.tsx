'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const OrderSuccessPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="alert alert-success text-center">
          <h4 className="alert-heading">Thank You!</h4>
          <p>Your order has been placed successfully.</p>
          <hr />
          <p className="mb-0">
            <Link href="/" className="btn btn-primary">Continue Shopping</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
