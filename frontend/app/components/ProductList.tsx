'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  condition: 'NEW' | 'SECONDHAND';
  category: string;
  brand: string;
  imageUrl: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [conditionFilter, setConditionFilter] = useState<'ALL' | 'NEW' | 'SECONDHAND'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to view products.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedProducts: Product[] = response.data;
        setProducts(fetchedProducts);

        const uniqueCategories = ['ALL', ...Array.from(new Set(fetchedProducts.map(p => p.category)))];
        setCategories(uniqueCategories);

        const uniqueBrands = ['ALL', ...Array.from(new Set(fetchedProducts.map(p => p.brand)))];
        setBrands(uniqueBrands);

      } catch (error) {
        setMessage('Failed to fetch products. Please try logging in again.');
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let tempProducts = products;

    if (searchTerm) {
        tempProducts = tempProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (conditionFilter !== 'ALL') {
      tempProducts = tempProducts.filter(p => p.condition === conditionFilter);
    }

    if (categoryFilter !== 'ALL') {
      tempProducts = tempProducts.filter(p => p.category === categoryFilter);
    }

    if (brandFilter !== 'ALL') {
        tempProducts = tempProducts.filter(p => p.brand === brandFilter);
    }

    setFilteredProducts(tempProducts);
  }, [conditionFilter, categoryFilter, brandFilter, searchTerm, products]);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <h4 className="mb-3">Filters</h4>
          
          <h5 className="mb-2">Condition</h5>
          <div className="list-group mb-4">
            <button type="button" className={`list-group-item list-group-item-action ${conditionFilter === 'ALL' ? 'active' : ''}`} onClick={() => setConditionFilter('ALL')}>All Conditions</button>
            <button type="button" className={`list-group-item list-group-item-action ${conditionFilter === 'NEW' ? 'active' : ''}`} onClick={() => setConditionFilter('NEW')}>New</button>
            <button type="button" className={`list-group-item list-group-item-action ${conditionFilter === 'SECONDHAND' ? 'active' : ''}`} onClick={() => setConditionFilter('SECONDHAND')}>Secondhand</button>
          </div>

          <h5 className="mb-2">Category</h5>
          <div className="list-group mb-4">
            {categories.map(category => (
              <button key={category} type="button" className={`list-group-item list-group-item-action ${categoryFilter === category ? 'active' : ''}`} onClick={() => setCategoryFilter(category)}>
                {category}
              </button>
            ))}
          </div>

          <h5 className="mb-2">Brand</h5>
          <div className="list-group">
            {brands.map(brand => (
              <button key={brand} type="button" className={`list-group-item list-group-item-action ${brandFilter === brand ? 'active' : ''}`} onClick={() => setBrandFilter(brand)}>
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-4">Products</h2>
                <div className="mb-4" style={{ width: '50%' }}>
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
          {message && <div className="alert alert-warning">{message}</div>}
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products match the current filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
