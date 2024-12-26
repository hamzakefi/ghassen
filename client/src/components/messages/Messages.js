import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:7500/api/message";

const MessagesApp = () => {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState(null);

  // Récupérer les messages au chargement
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/allMessages`);
      setMessages(response.data.listMessages);
    } catch (err) {
      setError("Erreur lors du chargement des messages.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/postMessage`, formData);
      setMessages([...messages, response.data.newMessage]);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError("Erreur lors de l'envoi du message.");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression du message.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      {/* Formulaire pour envoyer un message */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <TextField
          label="Nom"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
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

      {/* Afficher les messages */}
      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}
      <List>
        {messages.map((msg) => (
          <ListItem
            key={msg._id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleDeleteMessage(msg._id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${msg.name} (${msg.email})`}
              secondary={msg.message}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default MessagesApp;
