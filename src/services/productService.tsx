import axios from 'axios';
import type { ApiProduct } from '@/types';
import { API_URL } from '@/lib/apiUrl';

export async function getProducts(): Promise<ApiProduct[]> {
  const { data } = await axios.get<ApiProduct[]>(`${API_URL}/products`);
  return data;
}

export async function getProductById(id: number | string): Promise<ApiProduct> {
  const { data } = await axios.get<ApiProduct>(`${API_URL}/products/${id}`);
  return data;
}
