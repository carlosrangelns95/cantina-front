import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import LayoutAdmin from './components/LayoutAdmin/layoutAdmin';
import LayoutStudent from './components/LayoutStudent/layoutStudent';
import PrivateRoute from './components/privateRoute';
import MenuList from './components/MenuList/MenuList';
import SelfRegister from './components/SelfRegister/SelfRegister';
import './App.css';
import ConfirmationPage from './components/ConfirmationPage/ConfirmationPage';
import OrderHistory from './components/OrderHistory/OrderHistory';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SelfRegister />} />

        <Route element={<PrivateRoute allowedProfiles={['ADMIN']} />}>
          <Route path="/admin" element={<LayoutAdmin />}>
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

        <Route path="/logout" element={<p className="dashboard-container">Você foi desconectado.</p>} />

      </Routes>
    </Router>
  );
}

export default App;