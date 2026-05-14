import axios from 'axios';
import type { CreateOrderRequest, OrderResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function createOrder(
  request: CreateOrderRequest
): Promise<OrderResponse> {
  const { data } = await api.post<OrderResponse>('/orders', request);
  return data;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderResponse> {
  const { data } = await api.get<OrderResponse>(
    `/orders/number/${orderNumber}`
  );
  return data;
}
