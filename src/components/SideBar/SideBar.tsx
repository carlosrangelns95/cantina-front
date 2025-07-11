import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Sidebar() {
    const navigate = useNavigate();
    const { getTotalItems } = useCart()

    const totalItemsInCart = getTotalItems();

    const handleLogout = () => {
        localStorage.removeItem('cantina-token');
        navigate('/login', { replace: true });
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>Cantina App</h3>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/student/menu">Cardápio</NavLink>
                </li>
                <li style={{ position: 'relative' }}>
                    <NavLink to="/student/cart">Carrinho</NavLink>
                    {totalItemsInCart > 0 && (
                        <span className="cart-count">{totalItemsInCart}</span>
                    )}
                </li>
                <li>
                    <NavLink to="/student/history">Histórico</NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <button onClick={handleLogout}>Sair</button>
            </div>
        </aside>
    );
}