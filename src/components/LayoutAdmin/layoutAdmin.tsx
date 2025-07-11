import './layoutAdmin.css';
import Sidebar from '../SideBar/SideBar';

export default function LayoutAdmin() {
    const handleLogout = () => {
        localStorage.removeItem('cantina-token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <nav>
                    <button onClick={handleLogout}>Sair</button>
                </nav>
                {/* <div className="dashboard-container">
                    <h2>Bem-vindo, Administrador!</h2>
                    <p>Esta é a área administrativa da cantina.</p>
                </div> */}
            </main>
        </div>
    );
}