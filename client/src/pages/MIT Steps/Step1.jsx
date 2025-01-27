import React, { useEffect } from 'react';
import MusicalNotes from '../../components/Notation'


const Step1 = ({initialPitches, updatePitches}) => {
  
  
  const syllables = Array(initialPitches.length).fill('hm')

  const audioUrls = Array(initialPitches.length).fill('https://syllablepronounciations.s3.us-east-1.amazonaws.com/hums/')

  return (
    <div className="step">
     
      <h2>Step 1: Humming</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>Listen to the melody and gently hum along.</p>

      <MusicalNotes syllables={syllables} initialPitches={initialPitches} audioUrls={audioUrls} fading={false} alone={false} updatePitches={updatePitches}/>

    </div>
  );
};

export default Step1;
