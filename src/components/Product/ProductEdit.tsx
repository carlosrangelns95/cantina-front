import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
// import { fetchProductById, updateProduct } from '../api/product';

const ProductEdit = () => {
    const { id } = useParams(); // Pega o ID da URL
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError(null);
            const data = await fetchProductById(id);
            if (data) {
                setProductData(data);
            } else {
                setError('Produto não encontrado ou erro ao carregar.');
            }
            setLoading(false);
        };
        loadProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: name === 'price' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (!productData.name || productData.price <= 0) {
            setError('Nome e preço (maior que zero) são obrigatórios.');
            setSaving(false);
            return;
        }

        const updatedProduct = await updateProduct(id, productData);
        if (updatedProduct) {
            alert('Produto atualizado com sucesso!');
            navigate('/products');
        } else {
            setError('Não foi possível atualizar o produto. Verifique os dados e tente novamente.');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando produto...</span>
                </Spinner>
                <p className="mt-3">Carregando dados do produto...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
                <Button onClick={() => navigate('/products')}>Voltar para a Lista</Button>
            </Container>
        );
    }

    if (!productData) {
        return (
            <Container className="mt-5">
                <Alert variant="info">Nenhum dado de produto disponível para edição.</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Editar Produto</h2>
                <Button variant="secondary" onClick={() => navigate('/products')}>
                    <FaArrowLeft className="me-2" /> Voltar
                </Button>
            </div>

            <Card className="p-4">
                <Card.Body>
                    {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">Nome do Produto</Form.Label>
                            <Form.Control
                                type="text"
                                id="name"
                                name="name"
                                value={productData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="price">Preço</Form.Label>
                            <Form.Control
                                type="number"
                                id="price"
                                name="price"
                                value={productData.price || 0}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="description">Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                id="description"
                                name="description"
                                value={productData.description || ''}
                                onChange={handleChange}
                                rows={3}
                            />
                        </Form.Group>

                        {/* Adicione outros campos aqui */}

                        <Button variant="primary" type="submit" disabled={saving} className="w-100 mt-3">
                            {saving ? (
                                <Spinner animation="border" size="sm" className="me-2" />
                            ) : (
                                <FaSave className="me-2" />
                            )}
                            Salvar Alterações
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProductEdit;