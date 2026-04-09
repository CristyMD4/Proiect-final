import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  getCart,
  addToCart as storageAdd,
  removeFromCart as storageRemove,
  updateQty as storageUpdate,
  clearCart as storageClear,
  listProducts,
} from "../lib/shopStorage";

type CartItem = ReturnType<typeof listProducts>[number] & {
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
};

type CartProviderProps = {
  children: ReactNode;
};

const CartCtx = createContext<CartContextValue | null>(null);

function enrichCart(rawCart: Array<{ id: string; quantity: number }>) {
  const products = listProducts();

  return rawCart
    .map(({ id, quantity }) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean) as CartItem[];
}

export function CartProvider({ children }: CartProviderProps) {
  const [raw, setRaw] = useState(() => getCart());

  const refresh = useCallback(() => setRaw(getCart()), []);

  const addToCart = useCallback((id: string) => {
    storageAdd(id);
    refresh();
  }, [refresh]);

  const removeFromCart = useCallback((id: string) => {
    storageRemove(id);
    refresh();
  }, [refresh]);

  const updateQty = useCallback((id: string, qty: number) => {
    storageUpdate(id, qty);
    refresh();
  }, [refresh]);

  const clearCart = useCallback(() => {
    storageClear();
    refresh();
  }, [refresh]);

  const cartItems = enrichCart(raw);
  const cartCount = raw.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartCtx.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const context = useContext(CartCtx);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
