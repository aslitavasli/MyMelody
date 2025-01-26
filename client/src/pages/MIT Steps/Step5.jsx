import React, { useEffect } from 'react';
import MusicalNotes from '../../components/Notation'

//This step is humming
const Step5 = ({pronounciations, spellings, initialPitches, updatePitches}) => {
 
  const syllables = spellings;
  const pitches = initialPitches;
  const audioUrls = pronounciations

  return (
    <div className="step">
      <h2>Step 5: Alone</h2>
    
      <p>You are amazing. Continue!</p>

      <div>
      <MusicalNotes syllables={syllables} initialPitches={pitches} audioUrls={audioUrls} fading={false} alone={true} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step5;
