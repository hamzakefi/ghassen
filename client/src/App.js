import './App.css';
import Sidebar from './components/auth/sidebar';
import Listproduct from './pages/Listproduct';
import AddProduct from './pages/Addproduct';
import Auth from './components/auth/auth';
import { Routes, Route } from 'react-router-dom'; 
import Profile from './pages/Profile';
import UserProducts from './pages/ProductUser';
import MessagesApp from './components/messages/Messages';
import MessageAdmin from './components/messages/MessageAdmin';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); 

  return (
    <div>
      {isAuthenticated && <Sidebar />}

      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/products" element={<Listproduct />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/messages" element={<MessagesApp/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Userproduct" element={<UserProducts />} />
            <Route path="/admin/messages" element={<MessageAdmin/>} />



          </>
        ) : (
          <Route path="*" element={<Auth />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
