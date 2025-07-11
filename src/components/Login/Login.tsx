import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                throw new Error(errorData.message || 'Falha na requisição para o endpoint de login.');
            }

            const resp = await loginResponse.json();
            const { token } = resp;
            localStorage.setItem('cantina-token', token);

            const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.message || 'Falha na requisição para o endpoint de usuário.');
            }

            const user = await userResponse.json();

            if (user.profiles[0].role === 'ADMIN') {
                navigate('/admin');
            } else if (user.profiles[0].role === 'STUDENT') {
                navigate('/student');
            } else {
                setError('Perfil de usuário desconhecido.');
            }

        } catch (err: any) {
            console.error('Erro no login:', err);
            if (err.message) {
                setError(err.message);
            } else {
                setError('Erro ao fazer login. Verifique suas credenciais.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <span>Ainda não possui conta? <a href="/register">Registre-se</a></span>
        </div>
    );
}