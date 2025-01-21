import React, { useEffect } from 'react';

//This step is humming
const Step6 = ({phrase}) => {


  return (
    <div className="step">
      <h2>What did you say?</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>{phrase}</p>

    </div>
  );
};

export default Step6;
