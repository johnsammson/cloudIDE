import React, { useState } from 'react';
import './Login.css';
import { io } from 'socket.io-client';
import apiClient from '../services/api-client';
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post("/user/login", {
        email: email,
        password: password
      });

      if (!response.data.user.socketUrl) {
        throw new Error('Socket URL not received from server');
      }

      // Initialize socket connection
      const newSocket = io(response.data.user.socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Return a promise that resolves when socket connects
      const socketConnection = new Promise((resolve, reject) => {
        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          resolve(newSocket);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          reject(err);
        });

        // Set a timeout for the connection attempt
        setTimeout(() => reject(new Error('Socket connection timeout')), 5000);
      });

      // Wait for socket to connect before proceeding
      const connectedSocket = await socketConnection;

      // Set up disconnect handler after connection is established
      connectedSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          connectedSocket.connect();
        }
      });

      // Update user context with connected socket
      setUser({
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role,
        socketUrl: response.data.user.socketUrl,
        port: response.data.user.port,
        Socket: connectedSocket  // Note: changed Socket to socket for consistency
      });

      alert(response.data.message);
      
      // Only navigate after everything is set up
      navigate("/editor");

    } catch (err) {
      console.error('Error during login:', err);
      setError(err.message || 'An error occurred during login');
      alert(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;