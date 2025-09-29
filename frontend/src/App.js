import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import UserOrdersPage from './pages/UserOrdersPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import WelcomePage from './pages/WelcomePage'; 
import ProductSummaryPage from './pages/ProductSummaryPage'; // Import the new ProductSummaryPage
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminUserFormPage from './pages/AdminUserFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-orders" element={<UserOrdersPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/products" element={<ProductListPage />} /> 
                <Route path="/products-summary" element={<ProductSummaryPage />} /> {/* New route for ProductSummaryPage */}
                <Route path="/" element={<WelcomePage />} /> 
                <Route
                  path="/products/:id"
                  element={
                    <PrivateRoute>
                      <ProductDetailPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <Routes>
                        <Route path="/" element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="products/new" element={<AdminProductFormPage />} />
                        <Route path="products/edit/:id" element={<AdminProductFormPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="users/edit/:id" element={<AdminUserFormPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                      </Routes>
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
