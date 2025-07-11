import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ allowedProfiles }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        console.log('teste')
        const verifyAuth = async () => {
            const token = localStorage.getItem('cantina-token');
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const userResponse = await fetch('http://localhost:9508/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!userResponse.ok) {
                    throw new Error('Falha na requisição para o endpoint de usuário.');
                }
                const user = await userResponse.json();

                setUserProfile(user.profiles[0].role);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                localStorage.removeItem('cantina-token');
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []); // Executa apenas uma vez no carregamento

    if (isAuthenticated === null) {
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedProfiles && !allowedProfiles.includes(userProfile)) {
        // Se o usuário não tem o perfil permitido para a rota, redireciona para o login ou uma página de acesso negado
        return <Navigate to="/login" replace />; // Ou para uma página de erro/acesso negado
    }

    return <Outlet />; // Renderiza o componente filho da rota protegida
}

export default PrivateRoute;