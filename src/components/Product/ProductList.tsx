import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';
// import ConfirmModal from '../components/ConfirmModal';
import './ProductStyles.css'
import ConfirmModal from '../ConfirmModal/ConfirmModal';

export default function ProductList() {
    console.log('ProductList');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product`);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateNew = () => {
        navigate('/admin/products/new');
    };

    const handleEdit = (id) => {
        navigate(`admin/products/edit/${id}`);
    };

    const handleDeleteClick = (id, name) => {
        setProductToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        setShowDeleteModal(false); // Fecha o modal primeiro
        setLoading(true); // Opcional: mostrar loading enquanto exclui
        try {
            const response = await fetch(`${API_URL}/product/${productToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao excluir: ${errorData.message || response.statusText}`);
            }
            alert('Produto excluído com sucesso!');
            fetchProducts(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao excluir produto:', err);
            alert(`Erro ao excluir produto: ${err.message}`);
        } finally {
            setLoading(false);
            setProductToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    if (loading) {
        return (
            <div className="product-container message-container">
                <div className="spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-container message-container">
                <p className="error-message">{error}</p>
                <button className="btn-save" onClick={fetchProducts}>Tentar Novamente</button>
            </div>
        );
    }

    return (
        <div className="product-container">
            <div className="product-header">
                <h2>Lista de Produtos</h2>
                <button className="btn-new-product" onClick={handleCreateNew}>
                    <FaPlusCircle /> Novo Produto
                </button>
            </div>

            {products.length === 0 ? (
                <p className="info-message">Nenhum produto encontrado. Clique em "Novo Produto" para adicionar um.</p>
            ) : (
                <ul className="product-list">
                    {products.map((product, index) => (
                        <li key={product.id} className="product-list-item">
                            <div className="product-info">
                                <span className="product-index">{index + 1}.</span>
                                <span>{product.name}</span>
                                <span className="ms-3 text-muted"> R$ {product.price ? product.price.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="product-actions">
                                <button className="btn-action btn-edit" onClick={() => handleEdit(product.id)}>
                                    <FaEdit /> Editar
                                </button>
                                <button className="btn-action btn-delete" onClick={() => handleDeleteClick(product.id, product.name)}>
                                    <FaTrashAlt /> Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmModal
                show={showDeleteModal}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};