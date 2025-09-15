'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  condition: 'NEW' | 'SECONDHAND';
  category: string;
  imageUrl: string;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid rounded" />
          </div>
          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p className="text-muted">{product.description}</p>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-success">${product.price.toFixed(2)}</h3>
                <span className={`badge fs-6 ${product.condition === 'NEW' ? 'bg-primary' : 'bg-warning'}`}>
                    {product.condition}
                </span>
            </div>
            <p className="mt-2">Category: <span className="badge bg-info">{product.category}</span></p>
            <hr />
            <div className="d-grid">
                <button className="btn btn-primary btn-lg" onClick={() => addToCart(product)}>
                    Add to Cart
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
