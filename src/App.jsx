import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import { Navbar } from './components';
import './i18n';
import { Box, CircularProgress } from '@mui/material';
import Home from './pages/Home';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // 置中整個頁面
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrderPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;