'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartApi from '@/services/cartService';
import type {
  ApiProduct,
  CartItem,
  CartState,
  CartContextValue,
  CartBackendResponse,
} from '@/types';

const initialState: CartState = {
  items: [],
  count: 0,
  isOpen: false,
  sessionId: null,
};

function backendToCartItems(response: CartBackendResponse): CartItem[] {
  return response.items.map((item) => ({
    cartItemId: item.itemId,
    quantity: item.quantity,
    product: {
      id: item.productId,
      name: item.productName,
      description: '',
      price: Number(item.unitPrice),
      imageUrl: item.productImageUrl,
      category: item.category,
      stock: item.availableStock,
      edition: null,
      featured: false,
      active: true,
      createdAt: '',
      images: [],
    },
  }));
}

function countItems(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.quantity, 0);
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(initialState);

  useEffect(() => {
    cartApi
      .initCart()
      .then((res) => {
        const items = backendToCartItems(res);
        setState((prev) => ({
          ...prev,
          sessionId: res.sessionId,
          items,
          count: countItems(items),
        }));
      })
      .catch(() => {
        // Backend unavailable — cart works in degraded local-only mode
      });
  }, []);

  const applyBackendResponse = useCallback((res: CartBackendResponse) => {
    const items = backendToCartItems(res);
    setState((prev) => ({
      ...prev,
      sessionId: res.sessionId,
      items,
      count: countItems(items),
    }));
  }, []);

  const addToCart = useCallback(
    async (product: ApiProduct) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        const res = await cartApi.updateItem(
          existing.cartItemId,
          existing.quantity + 1
        );
        applyBackendResponse(res);
      } else {
        // Optimistic: open drawer immediately
        setState((prev) => ({ ...prev, isOpen: true }));
        const res = await cartApi.addItem(product.id, 1);
        const items = backendToCartItems(res);
        setState((prev) => ({
          ...prev,
          sessionId: res.sessionId,
          isOpen: true,
          items,
          count: countItems(items),
        }));
      }
    },
    [state.items, applyBackendResponse]
  );

  const removeFromCart = useCallback(
    async (cartItemId: number) => {
      const res = await cartApi.removeItem(cartItemId);
      applyBackendResponse(res);
    },
    [applyBackendResponse]
  );

  const updateQty = useCallback(
    async (cartItemId: number, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }
      const res = await cartApi.updateItem(cartItemId, quantity);
      applyBackendResponse(res);
    },
    [removeFromCart, applyBackendResponse]
  );

  const clearCart = useCallback(async () => {
    await cartApi.clearCartApi();
    setState((prev) => ({ ...prev, items: [], count: 0 }));
  }, []);

  const toggleCart = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const closeCart = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
