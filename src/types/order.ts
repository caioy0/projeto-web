// @/types/order.ts

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

export interface Order {
  id: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};
