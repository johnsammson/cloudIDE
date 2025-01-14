import React from 'react'
import {   useNavigate } from "react-router-dom";
import '../App.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="ext-4xl font-bold text-blue-600">
            Welcome to Code Editor
          </h1>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600"
          >
            Login
          </button>
          <hr/>
          <button
            onClick={() => navigate('/signup')}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600"
          >
             Signup
          </button>
        </div>
      );
}

export default WelcomePage

