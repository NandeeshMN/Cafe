import axios from 'axios';

// Mocking API for frontend functionality
const MOCK_MENU = [
  { id: '1', name: 'Double Espresso', category: 'Beverages', price: 4.50, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80', description: 'Boffee Work' },
  { id: '2', name: 'Oat Milk Latte', category: 'Beverages', price: 5.75, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', description: 'Standard Size, Extra Hot' },
  { id: '3', name: 'Avocado Toast', category: 'Fast Food', price: 12.50, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80', description: 'Freshly Baked' },
  { id: '4', name: 'Butter Croissant', category: 'Snacks', price: 3.25, image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?w=500&q=80', description: 'Freshly Baked' },
  { id: '5', name: 'Stack Pancake', category: 'Fast Food', price: 10.95, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80', description: 'Safe work' },
  { id: '6', name: 'Flat White', category: 'Beverages', price: 4.95, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&q=80', description: 'Whole Milk, Double Shot' },
];

export const fetchMenu = async () => {
  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MENU), 500));
};

// Simulated order memory
const activeOrders = {};

export const placeOrder = async (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = '#AC-' + Math.floor(100000 + Math.random() * 900000);
      activeOrders[id] = { status: 'Pending', createdAt: Date.now() };
      resolve({ id, status: 'Pending' });
    }, 1000);
  });
};

export const fetchOrderStatus = async (orderId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = activeOrders[orderId];
      if (!order) {
        resolve({ status: 'Unknown' });
        return;
      }
      // Simulate status progression based on time passed
      const elapsedSec = (Date.now() - order.createdAt) / 1000;
      let newStatus = 'Pending';
      if (order.status === 'Cancelled') {
        newStatus = 'Cancelled';
      } else if (elapsedSec > 40) {
        newStatus = 'Served';
      } else if (elapsedSec > 25) {
        newStatus = 'Ready';
      } else if (elapsedSec > 10) {
        newStatus = 'Preparing';
      }
      
      activeOrders[orderId].status = newStatus;
      resolve({ status: newStatus });
    }, 500); // 500ms network delay
  });
};

export const cancelOrder = async (orderId, reason) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (activeOrders[orderId]) {
        activeOrders[orderId].status = 'Cancelled';
      }
      resolve({ status: 'Cancelled' });
    }, 800);
  });
};
