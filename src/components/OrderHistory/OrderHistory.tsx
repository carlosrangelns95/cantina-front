import { useState, useEffect } from 'react';
import './OrderHistory.css';
import type { IOrder } from '../../types/types';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('cantina-token');
                if (!token) {
                    setError('Você não está autenticado. Por favor, faça login novamente.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/order/my-orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();

                console.log('Orders:', data);

                setOrders(data);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching order history:", err.response ? err.response.data : err.message);
                if (err.response && err.response.status === 401) {
                    setError('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
                } else {
                    setError('Não foi possível carregar seu histórico de pedidos. Tente novamente.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="order-history-container"><p>Carregando histórico de pedidos...</p></div>;
    }

    if (error) {
        return <div className="order-history-container"><p className="error-message">{error}</p></div>;
    }

    if (orders.length === 0) {
        return <div className="order-history-container"><p>Você ainda não tem nenhum pedido.</p></div>;
    }

    return (
        <div className="order-history-container">
            <h2>Seu Histórico de Pedidos</h2>
            <div className="orders-list">
                {orders.map((order: IOrder) => (
                    <div key={order.id} className="order-card">
                        <h3>Pedido #{order.id.substring(0, 8)}</h3>
                        <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()} às {new Date(order.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Total:</strong> R$ {parseFloat(order.total).toFixed(2)}</p>
                        <div className="order-items">
                            <h4>Itens do Pedido:</h4>
                            <ul>
                                {order.orderItems.map(item => (
                                    <li key={item.id}>
                                        {item.name || 'Produto Desconhecido'} - {item.quantity} x R$ {parseFloat(item.price).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}