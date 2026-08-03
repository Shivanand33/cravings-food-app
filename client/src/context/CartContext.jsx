import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (newItem) => {
    if (!newItem || !newItem._id) return;

    setCart((prevCart) => {
      if (prevCart && prevCart.cartItem && prevCart.cartItem.length > 0) {
        if (prevCart.resturantID && prevCart.resturantID !== newItem.resturantID) {
          toast.error("Cart contains items from another restaurant. Clear cart first.");
          return prevCart;
        }

        const existingIndex = prevCart.cartItem.findIndex(
          (i) => i._id === newItem._id
        );

        let updatedItems;
        if (existingIndex > -1) {
          updatedItems = [...prevCart.cartItem];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: (updatedItems[existingIndex].quantity || 1) + 1,
          };
        } else {
          updatedItems = [
            ...prevCart.cartItem,
            { ...newItem, quantity: 1 },
          ];
        }

        const newCartValue = updatedItems.reduce(
          (acc, item) => acc + Number(item.price) * (item.quantity || 1),
          0
        );

        toast.success(`Added ${newItem.itemName} to cart`);
        return {
          ...prevCart,
          resturantID: newItem.resturantID,
          cartItem: updatedItems,
          cartValue: newCartValue,
        };
      } else {
        toast.success(`Added ${newItem.itemName} to cart`);
        return {
          resturantID: newItem.resturantID,
          cartItem: [{ ...newItem, quantity: 1 }],
          cartValue: Number(newItem.price),
        };
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      if (!prevCart || !prevCart.cartItem) return null;

      const updatedItems = prevCart.cartItem.filter((i) => i._id !== itemId);
      if (updatedItems.length === 0) {
        return null;
      }

      const newCartValue = updatedItems.reduce(
        (acc, item) => acc + Number(item.price) * (item.quantity || 1),
        0
      );

      return {
        ...prevCart,
        cartItem: updatedItems,
        cartValue: newCartValue,
      };
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prevCart) => {
      if (!prevCart || !prevCart.cartItem) return null;

      const updatedItems = prevCart.cartItem
        .map((item) => {
          if (item._id === itemId) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);

      if (updatedItems.length === 0) {
        return null;
      }

      const newCartValue = updatedItems.reduce(
        (acc, item) => acc + Number(item.price) * (item.quantity || 1),
        0
      );

      return {
        ...prevCart,
        cartItem: updatedItems,
        cartValue: newCartValue,
      };
    });
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem("cart");
  };

  const getItemCount = () => {
    if (!cart || !cart.cartItem) return 0;
    return cart.cartItem.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
