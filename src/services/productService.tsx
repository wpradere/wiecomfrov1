import axios from 'axios';
import type { ApiProduct } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export async function getProducts(): Promise<ApiProduct[]> {
  const { data } = await axios.get<ApiProduct[]>(`${API_URL}/products`);
  return data;
}

export async function getProductById(id: number | string): Promise<ApiProduct> {
  const { data } = await axios.get<ApiProduct>(`${API_URL}/products/${id}`);
  return data;
}
