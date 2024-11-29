import { Routes, Route } from 'react-router-dom'; // Assurez-vous d'importer Route en plus de Routes
import './App.css';
import Listproduct from './pages/Listproduct';
import AddProduct from './pages/Addproduct';

function App() {
  return (
    <div>
      <Routes> 
        <Route path="/products" element={<Listproduct />} />
        <Route path="/add" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

export default App;
