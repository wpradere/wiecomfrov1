export type Category = 'mugs' | 'apparel' | 'tech' | 'misc';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
  info: string;
}

export interface FilterOption {
  label: string;
  value: Category | 'all';
}

// ── Category ──────────────────────────────────────────────────────────────────

export interface CategoryDto {
  id: string;
  name: string;
  label: string | null;
  active: boolean;
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface ProductImageDto {
  id: string;
  imageUrl: string;
  altText: string | null;
  description: string | null;
  sortOrder: number;
}

export interface ProductAttributeDto {
  id: string;
  name: string;
  value: string;
  sortOrder: number;
}

export type ProductSection = 'SUBLIMACION' | 'ZONA_GEEK';

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: CategoryDto;
  section: ProductSection;
  stock: number;
  edition: string | null;
  featured: boolean;
  active: boolean;
  createdAt: string;
  images: ProductImageDto[];
  attributes: ProductAttributeDto[];
}

// ── Cart (local state) ────────────────────────────────────────────────────────

export interface CartItem {
  cartItemId: string;
  product: ApiProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  count: number;
  isOpen: boolean;
  sessionId: string | null;
}

export interface CartContextValue {
  state: CartState;
  addToCart: (product: ApiProduct) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQty: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
}

// ── Cart (backend response) ───────────────────────────────────────────────────

export interface CartItemBackendResponse {
  itemId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  category: CategoryDto;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  availableStock: number;
}

export interface CartBackendResponse {
  cartId: string;
  sessionId: string;
  items: CartItemBackendResponse[];
  totalItems: number;
  subtotal: number;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export interface ShippingAddressDto {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface CreateOrderRequest {
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddressDto;
  notes?: string;
}

export interface OrderItemResponse {
  itemId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  items: OrderItemResponse[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string | null;
  shippingZipCode: string | null;
  shippingCountry: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
