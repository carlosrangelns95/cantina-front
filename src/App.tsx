import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import LayoutAdmin from './components/LayoutAdmin/layoutAdmin';
import LayoutStudent from './components/LayoutStudent/layoutStudent';
import PrivateRoute from './components/privateRoute';
import MenuList from './components/MenuList/MenuList';
import SelfRegister from './components/SelfRegister/SelfRegister';
import ConfirmationPage from './components/ConfirmationPage/ConfirmationPage';
import OrderHistory from './components/OrderHistory/OrderHistory';
import ProductList from './components/Product/ProductList';
import ProductCreate from './components/Product/create/ProductCreate';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import ProductEdit from './components/Product/ProductEdit';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SelfRegister />} />

        <Route element={<PrivateRoute allowedProfiles={['ADMIN']} />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedProfiles={['STUDENT']} />}>
          <Route path="/student" element={<LayoutStudent />}>
            <Route index element={<MenuList />} />
            <Route path="menu" element={<MenuList />} />
            <Route path="cart" element={<ConfirmationPage />} />
            <Route path="history" element={<OrderHistory />} />
          </Route>
        </Route>

        <Route path="*" element={<h1 className="text-center mt-5">404 - Página Não Encontrada</h1>} />
        <Route path="/logout" element={<p className="dashboard-container">Você foi desconectado.</p>} />

      </Routes>
    </Router>
  );
}

export default App;