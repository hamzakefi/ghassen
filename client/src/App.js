import { Routes, Route } from 'react-router-dom'; // Assurez-vous d'importer Route en plus de Routes
import './App.css';
import Listproduct from './pages/Listproduct';
import AddProduct from './pages/Addproduct';
import Auth from './components/auth/auth'
function App() {
  return (
    <div>

      <Routes> 
        <Route path="/products" element={<Listproduct />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/auth" element={<Auth />} />

        
      </Routes>
    </div>
  );
}

export default App;
