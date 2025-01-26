import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, CircularProgress, Box, List, ListItem, ListItemText } from "@mui/material";

const API_URL = "http://localhost:7500/api/message";

const MessagesApp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    idUser: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [messages, setMessages] = useState([]);  // To store the user's messages

  const token = localStorage.getItem("token"); // Récupérer le token du localStorage

  // Charger les informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user/current", {
          headers: {
            Authorization: token, // Ajout du token dans les en-têtes
          },
        });
        setUser(response.data); // Stocker les données utilisateur
        setFormData({
          ...formData,
          name: response.data.name,
          email: response.data.email,
          idUser: response.data._id,
        });
        setError(null);
      } catch (err) {
        setError("Impossible de récupérer les informations utilisateur !");
      } finally {
        setLoading(false); // Terminer le chargement
      }
    };

    fetchUser();
  }, [token]);

  // Charger les messages de l'utilisateur
  useEffect(() => {
    const fetchMessages = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/getMessagesByUser/${user._id}`, {
            headers: {
              Authorization: token,
            },
          });
          setMessages(response.data.listMessages);
          setError(null);
        } catch (err) {
          setError("Impossible de récupérer les messages.");
        }
      }
    };

    fetchMessages();
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/postMessage`, formData);
      setFormData({ ...formData, phone: "", message: "" }); // Réinitialiser les champs modifiables
      setError(null);
      setSuccess(true); // Afficher le message de succès
      // Rafraîchir la liste des messages après envoi
      setMessages([...messages, formData]);
    } catch (err) {
      setError("Erreur lors de l'envoi du message.");
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
       <Typography variant="h6" gutterBottom>
        Vos Messages
      </Typography>
      
      <List>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Message: ${message.message}`}
              secondary={`Réponse: ${message.reponse || "Pas encore répondu"} | Statut: ${message.statut}`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h4" gutterBottom>
        Envoyer un Message
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom"
          name="name"
          value={formData.name}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true, // Champ non modifiable
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true, // Champ non modifiable
          }}
        />
        <TextField
          label="Téléphone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Envoyer
        </Button>
      </form>
      {success && (
        <Typography color="primary" variant="body1">
          Message envoyé avec succès !
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}
      
     
    </Container>
  );
};

export default MessagesApp;
