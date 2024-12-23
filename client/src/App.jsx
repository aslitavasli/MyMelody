import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as Pitchfinder from "pitchfinder";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

import PitchShift from './pages/PitchShift.jsx';


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

// const mic = require('mic');

function App() {
  
  return (
   
<>

    <Routes>
    <Route path="/pitchshift" element={<PitchShift />} />
    </Routes>
   </>
  )
}

export default App;
