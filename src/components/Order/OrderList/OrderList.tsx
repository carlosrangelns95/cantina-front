import { FaEdit, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './OrderList.css';
import type { IPedido, IOrder } from '../../../types/types';
import OrderDetailsModal from '../../OrderDetailsModal/OrderDetailsModal';

type ConfirmActionType = 'complete' | 'delete' | null;

export default function OrderList() {
    console.log('OrderList loaded');
    const [pedidos, setPedidos] = useState<IPedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [pendingActionOrder, setPendingActionOrder] = useState<{ order: IPedido; type: ConfirmActionType } | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<IOrder | null>(null); // Armazena os detalhes completos para o modal

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('cantina-token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data: IPedido[] = await response.json();
            setPedidos(data);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId: string) => {
        console.log('fetchOrderDetails', orderId);
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/order/find/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('cantina-token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes do pedido ${orderId}`);
            }
            const data = await response.json();
            setSelectedOrderDetails(data);
            setShowDetailsModal(true);
        } catch (err) {
            console.error('Erro ao buscar detalhes do pedido:', err);
            setError('Não foi possível carregar os detalhes do pedido.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirmClick = (pedido: IPedido) => {
        setPendingActionOrder({ order: pedido, type: 'complete' });
        setShowConfirmModal(true);
    };

    const handleDeleteClick = (pedido: IPedido) => {
        setPendingActionOrder({ order: pedido, type: 'delete' });
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!pendingActionOrder) return;

        setShowConfirmModal(false);
        setLoading(true);

        const { order, type } = pendingActionOrder;
        let successMessage = '';
        let errorMessage = '';
        let requestMethod = '';
        let requestUrl = '';

        try {
            if (type === 'complete') {
                requestMethod = 'PATCH';
                requestUrl = `${import.meta.env.VITE_API_URL}/order/complete/${order.id}`;
                successMessage = 'Pedido concluído com sucesso!';
                errorMessage = 'Erro ao concluir o pedido.';
            } else if (type === 'delete') {
                requestMethod = 'DELETE';
                requestUrl = `${import.meta.env.VITE_API_URL}/order/${order.id}`;
                successMessage = 'Pedido cancelado com sucesso!';
                errorMessage = 'Erro ao cancelar o pedido.';
            } else {
                throw new Error('Ação desconhecida.');
            }

            const response = await fetch(requestUrl, {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('cantina-token')}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`${errorMessage} ${errorData.message || response.statusText}`);
            }

            alert(successMessage);
            fetchOrders();

        } catch (err) {
            console.error(`Erro na ação (${type}):`, err);
            alert(`Erro: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
            setPendingActionOrder(null);
        }
    };

    const handleCancelConfirmModal = () => {
        setShowConfirmModal(false);
        setPendingActionOrder(null);
    };

    const handleShowDetails = (pedidoId: string) => {
        fetchOrderDetails(pedidoId);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOrderDetails(null);
    };

    const getConfirmModalProps = () => {
        if (!pendingActionOrder) {
            return { show: false, title: '', message: '', onConfirm: () => { }, onCancel: () => { } };
        }

        const { order, type } = pendingActionOrder;
        const orderIdentifier = order.id.substring(0, 8);

        if (type === 'complete') {
            return {
                show: showConfirmModal,
                title: 'Confirmar Conclusão',
                message: `Tem certeza que deseja marcar o pedido #${orderIdentifier} como concluído?`,
                confirmButtonText: 'Concluir Pedido',
                confirmButtonVariant: 'primary',
                onConfirm: handleConfirmAction,
                onCancel: handleCancelConfirmModal,
            };
        } else if (type === 'delete') {
            return {
                show: showConfirmModal,
                title: 'Confirmar Cancelamento',
                message: `Tem certeza que deseja cancelar o pedido #${orderIdentifier}? Esta ação não pode ser desfeita.`,
                confirmButtonText: 'Cancelar Pedido',
                confirmButtonVariant: 'danger',
                onConfirm: handleConfirmAction,
                onCancel: handleCancelConfirmModal,
            };
        }
        return { show: false, title: '', message: '', onConfirm: () => { }, onCancel: () => { } };
    };

    const confirmModalProps = getConfirmModalProps();

    if (loading) {
        return (
            <div className="product-container message-container">
                <div className="spinner"></div>
                <p>Carregando Pedidos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-container message-container">
                <p className="error-message">{error}</p>
                <button className="btn-save" onClick={fetchOrders}>Tentar Novamente</button>
            </div>
        );
    }

    return (
        <div className="product-container">
            <div className="product-header">
                <h2>Lista de Pedidos</h2>
            </div>

            {pedidos.length === 0 ? (
                <p className="info-message">Nenhum pedido encontrado.</p>
            ) : (
                <ul className="order-list">
                    {pedidos.map((pedido, index) => (
                        <li key={pedido.id} className="order-list-item">
                            <div className="order-info">
                                <span className="order-index">{index + 1}.</span>
                                <span>{pedido.id.substring(0, 8)}</span>
                                <span className="ms-3 text-muted"> - valor: R$ {pedido.total ? parseFloat(pedido.total).toFixed(2) : '0.00'}</span>
                                <span className="ms-3 text-muted"> - data: {new Date(pedido.createdAt).toLocaleDateString()} às {new Date(pedido.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="order-actions">
                                <button className="btn-action btn-info" onClick={() => handleShowDetails(pedido.id)}>
                                    <FaInfoCircle /> Detalhes
                                </button>
                                <button className="btn-action btn-edit" onClick={() => handleConfirmClick(pedido)}>
                                    <FaEdit /> Concluir
                                </button>
                                <button className="btn-action btn-delete" onClick={() => handleDeleteClick(pedido)}>
                                    <FaTrashAlt /> Cancelar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmModal {...confirmModalProps} />
            <OrderDetailsModal
                show={showDetailsModal}
                onHide={handleCloseDetailsModal}
                order={selectedOrderDetails}
            />
        </div>
    );
}