import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function AdminSidebar() {
    const navigate = useNavigate();

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
                    <NavLink to="/admin/dashboard">Painel geral</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/products">Produtos</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/history">Histórico</NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <button onClick={handleLogout}>Sair</button>
            </div>
        </aside>
    );
}