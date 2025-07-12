import './DashboardStyles.css'; // Estilos do dashboard

const DashboardCard = ({ title, value }) => {
    return (
        <div className="metric-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default DashboardCard;