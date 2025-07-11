import { useState, useEffect } from 'react';
import './OrderHistory.css';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                const response = await axios.get('http://localhost:9508/orders/my-orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching order history:", err.response ? err.response.data : err.message);
                if (err.response && err.response.status === 401) {
                    setError('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
                    // Optionally redirect to login: window.location.href = '/login';
                } else {
                    setError('Não foi possível carregar seu histórico de pedidos. Tente novamente.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array means this runs once on component mount

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
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <h3>Pedido #{order.id.substring(0, 8)}</h3> {/* Display first 8 chars of ID */}
                        <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()} às {new Date(order.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Status:</strong> <span className={`order-status ${order.status}`}>{order.status}</span></p>
                        <p><strong>Total:</strong> R$ {parseFloat(order.totalAmount).toFixed(2)}</p>
                        <div className="order-items">
                            <h4>Itens do Pedido:</h4>
                            <ul>
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        {/* Assuming item has a product object with name and price */}
                                        {item.product?.name || 'Produto Desconhecido'} - {item.quantity} x R$ {parseFloat(item.price).toFixed(2)}
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