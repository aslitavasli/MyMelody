import React, { useEffect } from 'react';

//This step is humming
const Step0 = ({phrase}) => {


  return (
    <div className="step">
      <h2>Your phrase is...</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>{phrase}</p>
      <p> PUT AN IMAGE REPRESENTATIVE</p>
    </div>
  );
};

export default Step0;
