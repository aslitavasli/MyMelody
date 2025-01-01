import React from 'react';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
              
      {/* Third Division */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => navigate('/levels')}>Start Practice Levels!</button>
      </div>
      
      {/* Second Division */}
      <div style={{ width: '100%', height: '200px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        {/* Place your image here */}
      </div>
      

      {/* First Division */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => navigate('/createlevel')}>Create Your Level!</button>
      </div>
  
    </div>
  );
}

export default Menu;
