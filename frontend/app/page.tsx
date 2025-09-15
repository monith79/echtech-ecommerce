import React from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <ProductList />
      </main>
    </div>
  );
}
