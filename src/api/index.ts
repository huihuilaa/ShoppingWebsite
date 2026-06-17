import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend-api.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const productAPI = {
  getProducts: (page: number, limit: number, sortBy: string) => 
    api.get('/products', { params: { page, limit, sortBy } }),
    
  searchProducts: (keyword: string) => 
    api.get('/products/search', { params: { keyword } }),
    
  getProductDetail: (productId: string) => 
    api.get(`/products/${productId}`),

  uploadProduct: (productData: any) => 
    api.post('/products', productData)
};

export const userAPI = {
  createUser: (uid: string, email: string) => 
    api.post('/users', { uid, email }),
    
  updateUser: (uid: string, data: { name: string; address: string; phone: string }) => 
    api.put(`/users/${uid}`, data),
    
  getOrders: (uid: string) => 
    api.get(`/users/${uid}/orders`)
};

export const cartAPI = {
  addToCart: (productId: string, spec: string, quantity: number) => 
    api.post('/cart', { productId, spec, quantity }),
    
  removeFromCart: (cartItemId: string) => 
    api.delete(`/cart/${cartItemId}`)
};

