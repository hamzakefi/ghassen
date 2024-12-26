import React from 'react';
import './sidebar.css';
import { ListGroup } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi"; // Icône de déconnexion
import { Link, Routes, Route, BrowserRouter } from 'react-router-dom'; // Import React Router
import logo from "../../select.png";
import Listproduct from '../../pages/Listproduct';
import AddProduct from '../../pages/Addproduct';

const Sidebar = () => {
  const handleLogout = () => {
    // Logique de déconnexion ici
    console.log('Déconnexion');
  };

  return (
    <BrowserRouter>
      <div className="layout">
        <div className="sidebar">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item className="sidebar-title">
              <Link to="/products">Liste des produits</Link>
            </ListGroup.Item>
            <ListGroup.Item className="sidebar-title">
              <Link to="/add">Ajouter un produit</Link>
            </ListGroup.Item>
            <ListGroup.Item className="sidebar-title">
              <Link to="/messages">Contact</Link>
            </ListGroup.Item>
          </ListGroup>
          {/* Icône et texte de déconnexion */}
          <div className="logout-container" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
            <span className="logout-text">Déconnecter</span>
          </div>
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/products" element={<Listproduct />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/messages" element={<div>Contactez-nous</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Sidebar;
