// src/components/Dashboard/Dashboard.tsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2'; // Mantido Bar para futuras implementações da Receita Diária
import DashboardCard from './DashboardCard'; // Assumindo que você tem este componente
import './DashboardStyles.css'; // Assumindo que você tem este CSS

// Assumindo a interface IOrder está definida em outro lugar, por exemplo, types/types.ts
import type { IOrder } from '../../types/types';

// Registrar componentes do Chart.js que serão usados
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement, // Necessário para o Doughnut
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allOrders, setAllOrders] = useState<IOrder[]>([]); // Armazena todos os pedidos sem filtro de data
    const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]); // Armazena pedidos filtrados por data

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('cantina-token')}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            const data: IOrder[] = await response.json();
            setAllOrders(data); // Salva todos os pedidos
            setFilteredOrders(data); // Inicialmente, filteredOrders são todos os pedidos
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            // setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    // Efeito para buscar os pedidos na montagem do componente
    useEffect(() => {
        fetchOrders();
    }, []);

    // Efeito para filtrar pedidos quando as datas (ou allOrders) mudam
    useEffect(() => {
        let currentFiltered = [...allOrders]; // Sempre começa com todos os pedidos

        if (startDate) {
            const start = startOfDay(parseISO(startDate));
            currentFiltered = currentFiltered.filter(order => isAfter(parseISO(order.createdAt), start));
        }
        if (endDate) {
            const end = endOfDay(parseISO(endDate));
            currentFiltered = currentFiltered.filter(order => isBefore(parseISO(order.createdAt), end));
        }

        setFilteredOrders(currentFiltered);
    }, [startDate, endDate, allOrders]); // Depende de startDate, endDate e allOrders (para re-filtrar se os dados brutos mudarem)

    // Métrica: Total de Itens Vendidos
    const totalItemsSold = filteredOrders.reduce((acc, order) => {
        return acc + order.orderItems.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
    }, 0);

    // Métrica: Total de Vendas (Receita)
    const totalRevenue = filteredOrders.reduce((acc, order) => {
        return acc + parseFloat(order.total);
    }, 0).toFixed(2);

    // Métrica: Número de Pedidos
    const numberOfOrders = filteredOrders.length;

    // --- Processar dados para gráfico de itens por categoria ---
    const itemsByCategory = filteredOrders.reduce((acc: { [key: string]: number }, order) => {
        order.orderItems.forEach(item => {
            // Garante que `product` e `category` existem antes de acessar
            // O `?` após `item.product` é crucial se `product` puder ser nulo/undefined
            const category = item.product?.category || 'Outros';
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
                    'rgba(255, 99, 132, 0.7)', // Vermelho
                    'rgba(54, 162, 235, 0.7)', // Azul
                    'rgba(255, 206, 86, 0.7)', // Amarelo
                    'rgba(75, 192, 192, 0.7)', // Verde
                    'rgba(153, 102, 255, 0.7)', // Roxo
                    'rgba(255, 159, 64, 0.7)',  // Laranja
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
                position: 'top' as const, // Chart.js exige 'top' como tipo literal
            },
            title: {
                display: false,
                text: 'Itens Vendidos por Categoria',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) { // Usar 'any' para simplicidade do tipo de contexto aqui
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

    // --- Processar dados para gráfico de Pedidos por Status ---
    const ordersByStatus = filteredOrders.reduce((acc: { [key: string]: number }, order) => {
        const status = order.status || 'Indefinido'; // Garante que há um status, mesmo que nulo
        acc[status] = (acc[status] || 0) + 1; // Incrementa a contagem para o status
        return acc;
    }, {});

    const statusLabels = Object.keys(ordersByStatus);
    const statusData = Object.values(ordersByStatus);

    const statusChartData = {
        labels: statusLabels,
        datasets: [
            {
                label: 'Número de Pedidos',
                data: statusData,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)', // Verde/Azul para Concluído
                    'rgba(255, 206, 86, 0.7)', // Amarelo para Pendente/Em Processamento
                    'rgba(255, 99, 132, 0.7)', // Vermelho para Cancelado
                    'rgba(153, 102, 255, 0.7)', // Roxo para outros status
                    'rgba(54, 162, 235, 0.7)', // Azul
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const statusChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Pedidos por Status',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + ' pedidos';
                        }
                        return label;
                    }
                }
            }
        },
    };

    // --- Processar dados para gráfico de vendas ao longo do tempo (Receita Diária) ---
    const salesByDay = filteredOrders.reduce((acc: { [key: string]: number }, order) => {
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
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Receita Diária',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
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


    if (loading) {
        return (
            <div className="product-container message-container">
                <div className="spinner"></div>
                <p>Carregando dados do dashboard...</p>
            </div>
        );
    }

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
                    <h3>Pedidos por Status</h3>
                    <Doughnut data={statusChartData} options={statusChartOptions} />
                </div>
                {/* <div className="chart-card">
                    <h3>Receita Diária</h3>
                    <Bar data={salesChartData} options={salesChartOptions} />
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;