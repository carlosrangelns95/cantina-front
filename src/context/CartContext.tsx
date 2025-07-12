import { createContext, useState, useContext, useEffect } from 'react';
import type { ICartContextType } from '../types/types';


export const CartContext = createContext<ICartContextType | null>(null);

export const CartProvider = ({ children }:  { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cantina-cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Erro ao carregar carrinho do localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cantina-cart', JSON.stringify(cartItems));
    }, [cartItems]);


    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            console.log('product: ', product);
            console.log('cartItems: ', cartItems);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { id: product.id, name: product.name, quantity: 1 }];
            }
        });
    }

    // Função para remover item do carrinho (ou diminuir quantidade)
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productId === productId);

            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter(item => item.productId !== productId);
            }
        });
    };

    // Função para obter a quantidade total de itens no carrinho (para o ícone)
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Função para limpar o carrinho
    const clearCart = () => {
        setCartItems([]);
    };

    // O valor que será fornecido para os componentes
    const cartContextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        getTotalItems,
        clearCart,
    };

    return (
        <CartContext.Provider value={cartContextValue} >
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