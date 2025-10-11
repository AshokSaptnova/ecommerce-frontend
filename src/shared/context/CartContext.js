import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const CART_ACTIONS = {
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SESSION_ID: 'SET_SESSION_ID'
};

const initialState = {
  sessionId: null,
  items: [],
  totals: {
    subtotal: 0,
    tax_amount: 0,
    shipping_amount: 0,
    total_amount: 0,
    currency: 'INR'
  },
  isLoading: false,
  error: null,
  metadata: {
    total_items: 0,
    tax_rate: 0.18,
    shipping_threshold: 500
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CART_ACTIONS.SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.payload
      };

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  const normalizeCartResponse = useCallback((data) => {
    if (!data) {
      return initialState;
    }

    const items = (data.items || []).map((item) => ({
      id: item.product_id || item.id,
      cartItemId: item.id,
      name: item.product_name || item.name,
      price: Number(item.unit_price ?? item.price ?? 0),
      quantity: item.quantity || 0,
      image: item.product_image || item.image || '/images/placeholder.jpg',
      slug: item.product_slug || item.slug,
      subtotal: Number(item.subtotal ?? (item.price || 0) * (item.quantity || 0)),
      variantId: item.variant_id || item.variantId,
      trackInventory: item.track_inventory ?? true,
      stockQuantity: item.stock_quantity ?? item.maxStock ?? null
    }));

    return {
      sessionId: data.session_id || apiService.sessionId || state.sessionId,
      items,
      totals: {
        subtotal: Number(data.subtotal ?? 0),
        tax_amount: Number(data.tax_amount ?? 0),
        shipping_amount: Number(data.shipping_amount ?? 0),
        total_amount: Number(data.total_amount ?? 0),
        currency: data.currency || 'INR'
      },
      metadata: {
        total_items: data.total_items ?? items.reduce((sum, item) => sum + item.quantity, 0),
        tax_rate: data.tax_rate ?? 0.18,
        shipping_threshold: data.shipping_threshold ?? 500
      }
    };
  }, [state.sessionId]);

  const loadCart = useCallback(async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const summary = await apiService.getCartSummary();
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: normalizeCartResponse(summary) });
    } catch (error) {
      console.error('Error loading cart summary:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Failed to load cart' });
    }
  }, [normalizeCartResponse]);

  // Initial load
  useEffect(() => {
    if (!state.sessionId) {
      dispatch({ type: CART_ACTIONS.SET_SESSION_ID, payload: apiService.sessionId });
    }
    loadCart();
  }, [loadCart, state.sessionId]);

  // Reload cart when authentication state changes
  useEffect(() => {
    console.log('Authentication state changed, reloading cart...');
    loadCart();
  }, [isAuthenticated, user, loadCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!product || !product.id || quantity <= 0) {
      console.warn('Invalid product or quantity provided to addToCart');
      return false;
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await apiService.addToCart(product.id, quantity);
      await loadCart();
      return true;
    } catch (error) {
      console.error('Add to cart failed:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return false;
    }
  }, [loadCart]);

  const removeFromCart = useCallback(async (identifier) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const item = state.items.find((cartItem) => cartItem.cartItemId === identifier || cartItem.id === identifier);

      if (!item) {
        console.warn('Item not found in cart:', identifier);
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      const apiId = apiService.isAuthenticated() ? item.cartItemId : item.id;
      await apiService.removeFromCart(apiId);
      await loadCart();
    } catch (error) {
      console.error('Remove from cart failed:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [loadCart, state.items]);

  const updateQuantity = useCallback(async (identifier, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(identifier);
      return;
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const item = state.items.find((cartItem) => cartItem.cartItemId === identifier || cartItem.id === identifier);

      if (!item) {
        console.warn('Item not found in cart:', identifier);
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      const apiId = apiService.isAuthenticated() ? item.cartItemId : item.id;
      await apiService.updateCartItem(apiId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Update cart quantity failed:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [loadCart, removeFromCart, state.items]);

  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await apiService.clearCart();
      await loadCart();
    } catch (error) {
      console.error('Clear cart failed:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [loadCart]);

  const getCartItem = useCallback((productId) => state.items.find((item) => item.id === productId || item.product_id === productId), [state.items]);

  const isInCart = useCallback((productId) => !!getCartItem(productId), [getCartItem]);

  const value = useMemo(() => ({
    items: state.items,
    totals: state.totals,
    metadata: state.metadata,
    isLoading: state.isLoading,
    error: state.error,
    sessionId: state.sessionId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart,
    getCartItemCount: (productId) => getCartItem(productId)?.quantity || 0,
    calculateSavings: () => state.items.reduce((savings, item) => {
      const originalPrice = item.originalPrice || item.price;
      const discount = originalPrice - item.price;
      return savings + (discount * item.quantity);
    }, 0),
    isEmpty: state.items.length === 0,
    cartCount: state.metadata.total_items,
    cartTotal: state.totals.total_amount,
    subtotal: state.totals.subtotal,
    taxAmount: state.totals.tax_amount,
    shippingAmount: state.totals.shipping_amount
  }), [
    state.items,
    state.totals,
    state.metadata,
    state.isLoading,
    state.error,
    state.sessionId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;