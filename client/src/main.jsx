import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CodeEditor from "./pages/CodeEditor";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <App/>
    
  </StrictMode>,
)
