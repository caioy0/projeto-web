// src/types/product.ts

// export interface ProductSummary {
//   id: string
//   name: string
//   description: string
//   price: number
// }

// // Produto completo (para edição/detalhes)
// export interface FullProduct extends ProductSummary {
//   price: number
//   sale: boolean
//   salePrice?: number | null
//   quantity: number
//   categoryId: string
//   createdAt: Date
//   updatedAt: Date
//}

export interface ProductSummary {
  id: string;
  name: string;
  description: string;
}

export interface FullProduct extends ProductSummary {
  price: number;
  quantity: number;
  categoryId: string
  sale: boolean;
  salePrice: number | null;
  image: string | null
  createdAt: Date
  updatedAt: Date
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale: boolean;
  salePrice?: number | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;   // <-- torne opcional
  categoryId: string;
}