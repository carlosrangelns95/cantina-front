import './OrderDetailsModal.css';

export default function OrderDetailsModal({ show, onHide, order }) {
    if (!show || !order) {
        return null;
    }

    return (
        <div className="custom-modal-overlay" onClick={onHide}>
            <div className="custom-modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="custom-modal-content">
                    <div className="custom-modal-header">
                        <h5 className="custom-modal-title">Detalhes do Pedido #{order.id.substring(0, 8)}</h5>
    
                        <button type="button" className="custom-modal-close-button" onClick={onHide}>
                            &times;
                        </button>
                    </div>

                    <div className="custom-modal-body">
                        <p>
                            <strong>Data:</strong>{' '}
                            {new Date(order.createdAt).toLocaleDateString()} às{' '}
                            {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                        <p>
                            <strong>Status:</strong> {order.status}
                        </p>
                        <p>
                            <strong>Total do Pedido:</strong> R${' '}
                            {parseFloat(order.total).toFixed(2)}
                        </p>

                        <h5 className="order-items-heading">Itens do Pedido:</h5>
                        {order.orderItems.length === 0 ? (
                            <p className="no-items-message">Nenhum item encontrado para este pedido.</p>
                        ) : (
                            <ul className="order-items-list">
                                {order.orderItems.map((item) => (
                                    <li key={item.id} className="order-item-list-item">
                                        <span className="item-name">{item.name || 'Produto Desconhecido'}</span>
                                        <span className="item-quantity-price">
                                            {item.quantity} x R${parseFloat(item.price).toFixed(2)} = R${' '}
                                            {(item.quantity * parseFloat(item.price)).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="custom-modal-footer">
                        <button type="button" className="custom-button custom-button-secondary" onClick={onHide}>
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}