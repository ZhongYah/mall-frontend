import axiosInstance from './axiosInstance';

export const placeOrderWithCart = async (cartItems) => {
  return axiosInstance().post('/api/orders/cart', 
    cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }))
  );
};

export const getOrders = async () => {
  return axiosInstance().get('/api/orders');
};
