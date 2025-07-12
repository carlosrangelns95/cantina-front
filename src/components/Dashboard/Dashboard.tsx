import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import DashboardCard from './DashboardCard';
import './DashboardStyles.css'; // Importa os estilos do dashboard

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Dados mockados (simulando a interface IOrder)
const mockOrders = [
    {
        id: 'ord1',
        createdAt: '2025-07-01T10:00:00Z',
        status: 'Concluído',
        total: '15.50',
        orderItems: [
            { id: 'item1', name: 'Coxinha', quantity: 2, price: '3.00', category: 'Salgados' },
            { id: 'item2', name: 'Coca-Cola', quantity: 1, price: '4.50', category: 'Bebidas' },
            { id: 'item3', name: 'Brigadeiro', quantity: 3, price: '2.00', category: 'Doces' },
        ],
    },
    {
        id: 'ord2',
        createdAt: '2025-07-05T14:30:00Z',
        status: 'Concluído',
        total: '25.00',
        orderItems: [
            { id: 'item4', name: 'Pizza Broto', quantity: 1, price: '15.00', category: 'Salgados' },
            { id: 'item5', name: 'Suco de Laranja', quantity: 2, price: '5.00', category: 'Bebidas' },
        ],
    },
    {
        id: 'ord3',
        createdAt: '2025-07-10T09:15:00Z',
        status: 'Concluído',
        total: '8.00',
        orderItems: [
            { id: 'item6', name: 'Bolo de Cenoura', quantity: 1, price: '8.00', category: 'Doces' },
        ],
    },
    {
        id: 'ord4',
        createdAt: '2025-07-12T01:01:09.000Z', // Data do seu exemplo
        status: 'Concluído',
        total: '6.00',
        orderItems: [
            { id: 'item7', name: 'Pão de Queijo', quantity: 2, price: '2.00', category: 'Salgados' },
            { id: 'item8', name: 'Café', quantity: 1, price: '2.00', category: 'Bebidas' },
        ],
    },
    {
        id: 'ord5',
        createdAt: '2025-07-11T21:08:52.000Z', // Data do seu exemplo
        status: 'Concluído',
        total: '12.00',
        orderItems: [
            { id: 'item9', name: 'Empada de Frango', quantity: 1, price: '6.00', category: 'Salgados' },
            { id: 'item10', name: 'Chá Gelado', quantity: 1, price: '3.00', category: 'Bebidas' },
            { id: 'item11', name: 'Pudim', quantity: 1, price: '3.00', category: 'Doces' },
        ],
    },
];


const Dashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(mockOrders); // Começa com todos os pedidos

    // Efeitos para filtrar pedidos quando as datas mudam
    useEffect(() => {
        let filtered = mockOrders;

        if (startDate) {
            const start = startOfDay(parseISO(startDate));
            filtered = filtered.filter(order => isAfter(parseISO(order.createdAt), start));
        }
        if (endDate) {
            const end = endOfDay(parseISO(endDate));
            filtered = filtered.filter(order => isBefore(parseISO(order.createdAt), end));
        }

        setFilteredOrders(filtered);
    }, [startDate, endDate]);

    // Métrica: Total de Itens Vendidos
    const totalItemsSold = filteredOrders.reduce((acc, order) => {
        return acc + order.orderItems.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
    }, 0);

    // Métrica: Total de Vendas (Receita)
    const totalRevenue = filteredOrders.reduce((acc, order) => {
        return acc + parseFloat(order.total);
    }, 0).toFixed(2); // Formata para 2 casas decimais

    // Métrica: Número de Pedidos
    const numberOfOrders = filteredOrders.length;

    // Processar dados para gráfico de itens por categoria
    const itemsByCategory = filteredOrders.reduce((acc, order) => {
        order.orderItems.forEach(item => {
            const category = item.category || 'Outros'; // Garante que há uma categoria
            acc[category] = (acc[category] || 0) + item.quantity;
        });
        return acc;
    }, {});

    const categoryLabels = Object.keys(itemsByCategory);
    const categoryData = Object.values(itemsByCategory);

    const categoryChartData = {
        labels: categoryLabels,
        datasets: [
            {
                label: 'Quantidade Vendida',
                data: categoryData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const categoryChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Itens Vendidos por Categoria',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + ' itens';
                        }
                        return label;
                    }
                }
            }
        },
    };

    // Processar dados para gráfico de vendas ao longo do tempo (Exemplo: Vendas diárias)
    const salesByDay = filteredOrders.reduce((acc, order) => {
        const date = order.createdAt.split('T')[0]; // Pega apenas a data (YYYY-MM-DD)
        acc[date] = (acc[date] || 0) + parseFloat(order.total);
        return acc;
    }, {});

    const sortedDates = Object.keys(salesByDay).sort();
    const dailySalesData = sortedDates.map(date => salesByDay[date]);

    const salesChartData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Receita Diária (R$)',
                data: dailySalesData,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const salesChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Receita Diária',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += 'R$ ' + context.parsed.y.toFixed(2);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Receita (R$)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Data',
                },
            },
        },
    };


    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">Painel Geral da Cantina</h2>

            <div className="dashboard-filters">
                <label htmlFor="startDate">De:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="endDate">Até:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div className="dashboard-metrics">
                <DashboardCard title="Total de Itens Vendidos" value={totalItemsSold} />
                <DashboardCard title="Receita Total" value={`R$ ${totalRevenue}`} />
                <DashboardCard title="Total de Pedidos" value={numberOfOrders} />
            </div>

            <div className="dashboard-charts">
                <div className="chart-card">
                    <h3>Itens Vendidos por Categoria</h3>
                    <Doughnut data={categoryChartData} options={categoryChartOptions} />
                </div>
                <div className="chart-card">
                    <h3>Receita Diária</h3>
                    <Bar data={salesChartData} options={salesChartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;