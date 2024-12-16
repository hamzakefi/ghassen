import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import Axios
import './auth.css';
import logo from '../../select.png';

const Auth = () => {
    const navigate = useNavigate(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
           
            setError('');

            const response = await axios.post('http://localhost:7500/api/user/login', {
                email,
                password,
            });

           
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/add'); 


        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Email ou mot de passe incorrect.');
            } else {
                setError('Impossible de se connecter. Vérifiez votre connexion.');
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-image-section">
                <img src={logo} alt="Logo" className="login-logo" />
                <h2>Welcome to Our Platform</h2>
                <p>Join us and make the most of our features!</p>
            </div>
            <div className="login-form-section">
                <div className="login-form-card">
                    <h2>Bienvenue</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Affichage des erreurs */}
                        {error && <p className="error-message">{error}</p>}
                        <div className="input-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
