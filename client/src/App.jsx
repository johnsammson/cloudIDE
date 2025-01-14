import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import CodeEditor from "./pages/CodeEditor";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import { SocketProvider } from './context/SocketContext';


function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/editor" element={<CodeEditor />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;