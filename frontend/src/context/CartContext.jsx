import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Génère une clé localStorage unique selon l'utilisateur connecté
const getCartKey = () => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      return `quickticket_cart_user_${user.id}`;
    } catch {
      // utilisateur invalide, clé de secours
    }
  }
  return 'quickticket_cart_guest';
};

export const CartProvider = ({ children }) => {
  const [cartKey, setCartKey] = useState(getCartKey);

  const [cart, setCart] = useState(() => {
    const key = getCartKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // Quand l'utilisateur change (connexion / déconnexion), recharger le bon panier
  useEffect(() => {
    const syncCart = () => {
      const newKey = getCartKey();
      setCartKey(newKey);
      const saved = localStorage.getItem(newKey);
      setCart(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('authStatusChanged', syncCart);
    return () => window.removeEventListener('authStatusChanged', syncCart);
  }, []);

  // Sauvegarder le panier à chaque changement
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  const addToCart = (ticketCategory, event, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.categoryId === ticketCategory.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.categoryId === ticketCategory.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, {
        categoryId: ticketCategory.id,
        categoryLabel: ticketCategory.libelle,
        price: ticketCategory.prix,
        eventId: event.id,
        eventTitle: event.titre,
        image_url: event.image_url,
        quantity
      }];
    });
  };

  const removeFromCart = (categoryId) => {
    setCart((prevCart) => prevCart.filter((item) => item.categoryId !== categoryId));
  };

  const updateQuantity = (categoryId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(categoryId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.categoryId === categoryId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
