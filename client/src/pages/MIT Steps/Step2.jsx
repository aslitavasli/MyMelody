import React, { useEffect } from 'react';
import MusicalNotes from '../../components/Notation'

//This step is humming
const Step2 = ({pronounciations, spellings, initialPitches, updatePitches}) => {
 
  return (
    <div className="step">
      <h2>Step 2: Listen and Tap</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>Listen and tap the rhythm with your fingers.</p>

      <div>
      <MusicalNotes syllables={spellings} initialPitches={initialPitches} audioUrls={pronounciations} fading={false} alone={false} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step2;
