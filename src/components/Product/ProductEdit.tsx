import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const categories = ['SALGADO', 'DOCE', 'BEBIDA', 'LANCHE', 'FRUTA'];

const ProductEdit = () => {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError(null);
            const rest = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`);
            if (!rest.ok) {
                throw new Error('Falha na requisição para o endpoint de produto.');
            }

            const data = await rest.json();

            if (data) {
                setProductData(data);
            } else {
                setError('Produto não encontrado ou erro ao carregar.');
            }

            console.log('data: ', data);

            setLoading(false);
        };
        loadProduct();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: name === 'value' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (!productData.name || productData.price <= 0) {
            setError('Nome e preço (maior que zero) são obrigatórios.');
            setSaving(false);
            return;
        }

        const resp = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                ...productData,
            }),
        });

        if (!resp.ok) {
            throw new Error('Falha na requisição para o endpoint de produto.');
        }

        const updatedProduct = await resp.json();

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
                <Button className='btn-back' onClick={() => navigate('/admin/products')}>Voltar para a Lista</Button>
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
                <Button variant="secondary" onClick={() => navigate('/admin/products')}>
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
                            <Form.Label htmlFor="value">Preço</Form.Label>
                            <Form.Control
                                type="number"
                                id="value"
                                name="value"
                                value={productData.value || 0}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="category">Categoria</Form.Label>
                            <Form.Select
                                id="category"
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>



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