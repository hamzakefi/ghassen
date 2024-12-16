import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate pour les redirections
import './App.css';
import Listproduct from './pages/Listproduct';
import AddProduct from './pages/Addproduct';
import Auth from './components/auth/auth';
import Sidebar from './components/auth/sidebar';
import Profile from './pages/Profile';
import UserProducts from './pages/ProductUser';

function App() {
  // Vérifier si l'utilisateur est connecté

  return (
    <div>
      <Routes>
        
          
            <Route path="/products" element={<Listproduct />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/productuser" element={<UserProducts />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dd" element={<Sidebar/>} />

          
        
      </Routes>
    </div>
  );
}

export default App;
