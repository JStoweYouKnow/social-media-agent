import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './firebase';
import SocialMediaAgent from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocialMediaAgent />
    </BrowserRouter>
  </React.StrictMode>
);