import React, { useEffect } from 'react';

//This step is humming
const Step1 = () => {
  useEffect(() => {
    const audio = new Audio('/assets/audio/step1.mp3');
    audio.play();
    return () => audio.pause();
  }, []);

  return (
    <div className="step">
      <h2>Listen and Tap</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>This is the description for Step 1.</p>
    </div>
  );
};

export default Step1;
