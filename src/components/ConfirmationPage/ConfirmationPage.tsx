import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ConfirmationPage.css';

export default function ConfirmationPage() {
    const { cartItems, getTotalItems, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Seu carrinho está vazio!");
            navigate('/student/cardapio');
            return;
        }

        try {
            const token = localStorage.getItem('cantina-token');
            if (!token) {
                alert('Você precisa estar logado para finalizar a compra.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/order/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems
                })
            });

            if (!response.ok) {
                throw new Error('Falha na requisição para o endpoint de pedido.');
            }

            await response.json();

            alert('Seu pedido foi realizado com sucesso!');
            clearCart();
            navigate('/student');
        } catch (error) {
            console.error('Erro ao finalizar a compra: ', error);
            alert('Erro ao finalizar a compra. Verifique o console para detalhes.');
        }
    };

    if (getTotalItems() === 0) {
        return (
            <div className="confirmation-container">
                <h2>Seu Carrinho está Vazio</h2>
                <p>Adicione itens ao cardápio para finalizar a compra.</p>
                <button onClick={() => navigate('/student/cardapio')}>Voltar ao Cardápio</button>
            </div>
        );
    }

    return (
        <div className="confirmation-container">
            <h2>Confirmação do Pedido</h2>
            <div className="cart-summary">
                {cartItems.map((item, index) => (
                    <div key={item.id} className="cart-item-summary">
                        <p>{index + 1} - {item.name} - Quantidade: {item.quantity}</p>
                    </div>
                ))}
            </div>
            <p className="total-items">Total de itens: {getTotalItems()}</p>
            <div className="confirmation-actions">
                <button onClick={handleCheckout} className="checkout-button">Finalizar Compra</button>
                <button onClick={() => navigate('/student/cardapio')} className="back-button">Voltar ao Cardápio</button>
            </div>
        </div>
    );
};