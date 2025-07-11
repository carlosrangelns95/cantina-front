import './layoutStudent.css';
import Sidebar from '../SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';

export default function LayoutStudent() {
    return (
        <CartProvider>
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-content">
                    <nav>
                        <p>Olá, fulano de tal</p>
                    </nav>
                    <div className="dashboard-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </CartProvider>
    );
}