export interface IOrder {
    id: string;
    createdAt: string;
    status: string;
    total: string;
    orderItems: {
        id: string;
        name: string;
        quantity: number;
        price: string;
    }[];
}

export interface ICartItem {
    id: string;
    quantity: number;
    name: string;
}

export interface ICartContextType {
    cartItems: ICartItem[];
    addToCart: (product: { id: string;[key: string]: any }) => void;
    removeFromCart: (productId: string) => void;
    getTotalItems: () => number;
    clearCart: () => void;
}

export interface IConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}