import axios from 'axios';
import type { CartBackendResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function initCart(): Promise<CartBackendResponse> {
  const { data } = await api.get<CartBackendResponse>('/cart');
  return data;
}

export async function addItem(
  productId: number,
  quantity: number
): Promise<CartBackendResponse> {
  const { data } = await api.post<CartBackendResponse>('/cart/items', {
    productId,
    quantity,
  });
  return data;
}

export async function updateItem(
  itemId: number,
  quantity: number
): Promise<CartBackendResponse> {
  const { data } = await api.patch<CartBackendResponse>(
    `/cart/items/${itemId}`,
    { quantity }
  );
  return data;
}

export async function removeItem(itemId: number): Promise<CartBackendResponse> {
  const { data } = await api.delete<CartBackendResponse>(
    `/cart/items/${itemId}`
  );
  return data;
}

export async function clearCartApi(): Promise<void> {
  await api.delete('/cart');
}
