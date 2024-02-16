import { CartItem, ShippingInfoType, User } from "./types";
export interface userReducerInitialState {
  user: User | null;
  loading: boolean;
}

export interface CartReducerInitialState {
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  shippingCharges: number;
  shippingInfo: ShippingInfoType;
}
