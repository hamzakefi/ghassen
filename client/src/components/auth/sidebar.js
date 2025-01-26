import React from 'react';
import './sidebar.css';
import { FiLogOut } from "react-icons/fi"; // Icône de déconnexion
import logo from "../../select.png";
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Récupérer l'information sur l'utilisateur et vérifier si l'utilisateur est admin
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin; // Si l'objet utilisateur existe, on récupère la valeur de is_admin

  const handleLogout = () => {
    localStorage.clear();
    console.log('Déconnexion réussie');
    window.location.href = '/login'; 
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="navbar-links">
          {/* Afficher la liste des produits seulement si l'utilisateur est admin */}
          {isAdmin && (
            <Link to="/products" className="navbar-link">Liste des produits</Link>
          )}
          <Link to="/add" className="navbar-link">Ajouter un produit</Link>

          {/* Afficher "Message Admin" ou "Message App" selon le rôle */}
          {isAdmin ? (
            <Link to="/admin/messages" className="navbar-link">Messages </Link>
          ) : (
            <Link to="/messages" className="navbar-link">Messages</Link>
          )}

          <Link to="/profile" className="navbar-link">Profile</Link>
          <Link to="/Userproduct" className="navbar-link">Vos produits</Link>
        </div>
        <div className="logout-container" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span className="logout-text">Déconnecter</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
