import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false); // 🔁 état pour la modale

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user/current", {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data);
        setFormData((prev) => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
          idUser: response.data._id,
        }));
      } catch (err) {
        toast.error("Impossible de récupérer les informations utilisateur !");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

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
        } catch (err) {
          toast.error("Impossible de récupérer les messages.");
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
      setFormData({ ...formData, phone: "", message: "" });
      toast.success("Message envoyé avec succès !");
      setOpen(false); // 🔁 fermer la modale

      const response = await axios.get(`${API_URL}/getMessagesByUser/${formData.idUser}`, {
        headers: {
          Authorization: token,
        },
      });
      setMessages(response.data.listMessages);
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message.");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Vos Messages
      </Typography>

      <Grid container spacing={2}>
        {messages.map((message, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle1">
                  📩 <strong>Message :</strong> {message.message}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📬 <strong>Réponse :</strong> {message.reponse || "Pas encore répondu"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📌 <strong>Statut :</strong> {message.statut || "non lu"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          ✉️ Envoyer un Message
        </Button>
      </Box>

      {/* ✅ Modal pour le formulaire */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Envoyer un Message</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Nom"
              name="name"
              value={formData.name}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              Envoyer
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default MessagesApp;
