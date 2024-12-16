import React from 'react';
import './sidebar.css';
import { ListGroup,Button } from "react-bootstrap";
import logo from "../../select.png";  // Assurez-vous que le chemin d'accès est correct
import { FiLogOut } from "react-icons/fi";  // Icône de déconnexion
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate pour les redirections
import UserProducts from '../../pages/ProductUser';
import Listproduct from '../../pages/Listproduct';

const Sidebar = () => {
    const handleLogout = () => {
        // Logique de déconnexion ici, par exemple effacer le token, rediriger vers la page de login, etc.
        console.log('Déconnexion');
      };
  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item className="sidebar-title">Liste des produits</ListGroup.Item>
          <ListGroup.Item className="sidebar-title">Ajouter un produit</ListGroup.Item>
          <ListGroup.Item className="sidebar-title">Contact</ListGroup.Item>
        </ListGroup>
        {/* Icône et texte de déconnexion */}
        <div className="logout-container" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span className="logout-text">Déconnecter</span>
        </div>
      </div>
      <div className="main-content">
        {/* Contenu principal ici */}
        <Listproduct />
              </div>
    </div>
  );
}

export default Sidebar;
