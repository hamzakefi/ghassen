import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:7500/api/message";

const MessageAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/allMessages`);
      setMessages(response.data.listMessages);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success("Message supprimé avec succès");
    } catch (err) {
      toast.error("Erreur lors de la suppression du message.");
    }
  };

  const handleStatusUpdate = async (id, statut) => {
    try {
      await axios.patch(`${API_URL}/status/${id}`, { statut });
      fetchMessages();
      toast.success("Statut mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleReply = async (id) => {
    try {
      await axios.post(`${API_URL}/reply/${id}`, { reponse: responses[id] });
      setResponses({ ...responses, [id]: "" });
      fetchMessages();
      toast.success("Réponse envoyée avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'envoi de la réponse.");
    }
  };

  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Liste des Messages
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Réponse</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg._id}>
                  <TableCell>{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{msg.message}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      value={msg.statut || "non traité"}
                      onChange={(e) => handleStatusUpdate(msg._id, e.target.value)}
                      fullWidth
                      size="small"
                    >
                      <option value="non traité">Non traité</option>
                      <option value="en cours">En cours</option>
                      <option value="traité">Traité</option>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <TextField
                        value={responses[msg._id] || ""}
                        onChange={(e) => handleResponseChange(msg._id, e.target.value)}
                        placeholder="Ajouter une réponse"
                        size="small"
                        fullWidth
                      />
                      <Button
                        onClick={() => handleReply(msg._id)}
                        variant="contained"
                        color="primary"
                        size="small"
                        fullWidth
                      >
                        Envoyer
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDeleteMessage(msg._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MessageAdmin;
