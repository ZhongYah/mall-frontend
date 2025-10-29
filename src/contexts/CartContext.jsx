import { createContext, useState, useEffect } from 'react';

// 建立 CartContext
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

// CartProvider 包裝組件
export const CartProvider = ({ children }) => {
  // 從 localStorage 初始化
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 同步 cart 到 localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 新增商品到購物車
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        // 已存在就增加數量
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 更新商品數量
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  // 從購物車移除商品
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // 清空購物車
  const clearCart = () => setCart([]);

  // 計算總金額
  const totalAmount = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};
