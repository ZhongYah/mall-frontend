import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import { Navbar } from './components';
import { CartProvider } from './contexts/CartContext'
import './i18n';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
             <Route path="/products" element={<ProductListPage />} /> 
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/products" />} />
          </Routes>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
