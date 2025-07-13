import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import './MenuList.css';

export default function MenuList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState<true | false>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const { addToCart, cartItems } = useCart();


    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Falha na requisição para o endpoint de itens.');
            }
            const responseData = await response.json();
            setItems(responseData);

        } catch (err) {
            console.error('Erro ao buscar itens:', err);
            setError('Não foi possível carregar o cardápio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect para buscar os itens apenas uma vez ao montar o componente
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Função para filtrar os itens baseado na busca e categoria
    const filteredItems = useMemo(() => {
        let currentItems = items;

        // Aplica o filtro de busca
        if (search) {
            currentItems = currentItems.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Aplica o filtro de categoria
        if (category) {
            currentItems = currentItems.filter((item) =>
                item.category === category
            );
        }

        return currentItems;
    }, [items, search, category]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };

    if (loading) return <div className="loading-message">Carregando cardápio...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="menu-list-container">
            <h2>Cardápio</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar item..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <select value={category} onChange={handleCategoryChange}>
                    <option value="">Todas as Categorias</option>
                    <option value="salgado">Salgados</option>
                    <option value="doce">Doces</option>
                    <option value="bebida">Bebidas</option>
                    <option value="lanche">Lanches</option>
                    <option value="fruta">Frutas</option>
                </select>
            </div>

            {filteredItems.length === 0 ? (
                <p className="no-items">Nenhum item encontrado com os filtros aplicados.</p>
            ) : (
                <div className="menu-grid">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="menu-item-card">
                            <h3>{item.name}</h3>
                            <p className="item-price">R$ {item.value.toFixed(2)}</p>
                            <p className="item-category">{item.category}</p>
                            <button className='btn-add-to-cart' onClick={() => addToCart(item)}>Adicionar ao Carrinho</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};