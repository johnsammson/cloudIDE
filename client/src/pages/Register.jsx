// src/LoginForm.js
import React, { useState } from 'react';
import './Login.css';
import apiClient from '../services/api-client';
import {   useNavigate } from "react-router-dom";

const Register = () => {
  const [username,setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("at least getting here");
    

    try{
      const data = { email: email, password: password , username: username};
      await apiClient.post("/user/register", data).then(async (res) => {
        alert('User Created')
        console.log(res.data.user);
        try{
          await apiClient.post(`/container/create-container/${res.data.user.username}/${res.data.user.port}`).then((res) => {
            console.log(res.data)
          })
        }catch(err){
            console.log(err)
        }
        navigate('/login')
      })
    }catch(err){
        console.log(err)
    }

    

    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="login-button">SignUp</button>
      </form>
    </div>
  );
};

export default Register;
