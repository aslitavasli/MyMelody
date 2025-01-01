import React from 'react';
import { useNavigate } from 'react-router-dom';

function PracticeLevels() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
              
      {/* Third Division */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => navigate('/levels')}>Vocabulary</button>
      </div>
      
       {/* First Division */}
       <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => navigate('/createlevel')}>Adjectives</button>
      </div>
  

      {/* First Division */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => navigate('/createlevel')}>Phrases </button>
      </div>
  
    </div>
  );
}

export default PracticeLevels;
