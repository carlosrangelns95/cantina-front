import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelfRegister.css';

export default function SelfRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [category, setCategory] = useState('STUDENT');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        const userData = {
            name,
            email,
            password,
            category,
            phone,
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const teste = await response.json();
            setError(teste.message[0]);
        } else {

            await response.json();
            setSuccessMessage('Cadastro realizado com sucesso! Você será redirecionado para o login.');

            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPhone('');
            setCategory('STUDENT');

            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
        }

    };

    return (
        <div className="self-register-container">
            <h2>Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nome Completo:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Senha:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Telefone:</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profile">Eu sou:</label>
                    <select
                        id="profile"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    >
                        <option value="STUDENT">Estudante</option>
                        <option value="RESPONSIBLE">Responsável</option>
                    </select>
                </div>

                <button type="submit">Cadastrar</button>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};