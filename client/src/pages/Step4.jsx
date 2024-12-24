import React, { useEffect } from 'react';

const Step4 = () => {
  useEffect(() => {
    const audio = new Audio('/assets/audio/step1.mp3');
    audio.play();
    return () => audio.pause();
  }, []);

  return (
    <div className="step">
      <h2>Step 4</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>This is the description for Step 1.</p>
    </div>
  );
};

export default Step4;
