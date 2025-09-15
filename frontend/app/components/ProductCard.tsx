import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  condition: 'NEW' | 'SECONDHAND';
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={product.imageUrl} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text text-muted">{product.description}</p>
          </div>
        </Link>
        <div className="card-footer bg-transparent border-top-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-subtitle text-success">${product.price.toFixed(2)}</h6>
                <span className={`badge ${product.condition === 'NEW' ? 'bg-primary' : 'bg-warning'}`}>
                {product.condition}
                </span>
            </div>
            <button className="btn btn-primary w-100" onClick={() => addToCart(product)}>
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
