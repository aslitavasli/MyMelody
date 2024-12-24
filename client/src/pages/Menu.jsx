import React from 'react';

function ThreeDivLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* First Division */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => alert('First Button Clicked!')}>First Button</button>
      </div>
      
      {/* Second Division */}
      <div style={{ width: '100%', height: '200px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        {/* Place your image here */}
      </div>
      
      {/* Third Division */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #ccc' }}>
        <button onClick={() => alert('Second Button Clicked!')}>Second Button</button>
      </div>
    </div>
  );
}

export default ThreeDivLayout;
