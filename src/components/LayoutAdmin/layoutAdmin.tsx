import './layoutAdmin.css';
import AdminSidebar from '../SideBar/AdminSideBar';
import { Outlet } from 'react-router-dom';

export default function LayoutAdmin() {
    return (
        <div className="dashboard-layout">
            <AdminSidebar />
            <main className="dashboard-content">
                <nav>
                    <p>Olá, fulano de tal</p>
                </nav>
                <div className="dashboard-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}