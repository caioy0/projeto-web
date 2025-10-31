// @/types/order.ts

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};
