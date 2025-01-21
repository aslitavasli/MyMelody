import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as Pitchfinder from "pitchfinder";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

import CreateLevel from './pages/CreateLevel.jsx';
import Carousel from './pages/Carousel.jsx';
import Notation from './components/Notation.jsx';
import Menu from './pages/Menu.jsx';
import PracticeLevels from './pages/PracticeLevels.jsx';
import Introduction from './pages/Introduction.jsx';

import './styles/styles.css';

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

// const mic = require('mic');

function App() {
  
  return (
   
<>

    <Routes>
    <Route path="/" element={<Introduction />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/createlevel" element={<CreateLevel />} />
    <Route path="/practice" element={<Carousel />} />
    <Route path="/musicalnotation" element={<Notation/>}/>
    <Route path ="/levels" element={<PracticeLevels/>} />
    </Routes>
   </>
  )
}

export default App;
