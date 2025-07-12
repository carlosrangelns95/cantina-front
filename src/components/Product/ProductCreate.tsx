import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './ProductStyles.css';

const ProductCreate = () => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: name === 'price' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!productData.name.trim() || productData.price <= 0 || isNaN(productData.price)) {
            setError('Nome e preço (maior que zero) são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar produto.');
            }
            // const newProduct = await response.json(); // Opcional, se sua API retorna o produto criado
            alert('Produto criado com sucesso!');
            navigate('/admin/products');
        } catch (err) {
            console.error('Erro ao criar produto:', err);
            setError(`Erro ao criar produto: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-container">
            <div className="product-header">
                <h2>Novo Produto</h2>
                <button className="btn-back" onClick={() => navigate('/admin/products')}>
                    <FaArrowLeft /> Voltar
                </button>
            </div>

            <div className="product-form-card">
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Nome do Produto</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={productData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price" className="form-label">Preço</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="form-control"
                            value={productData.price}
                            onChange={handleChange}
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            value={productData.description}
                            onChange={handleChange}
                            rows={3}
                        ></textarea>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? (
                                <div className="spinner-small"></div>
                            ) : (
                                <FaSave />
                            )}
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreate;