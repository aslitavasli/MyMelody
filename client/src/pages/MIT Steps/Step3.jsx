import React, { useEffect } from 'react';
import MusicalNotes from '../../components/Notation'

//This step is humming
const Step3 = ({pronounciations, spellings, initialPitches, updatePitches}) => {
 
  const syllables = spellings;
  const pitches = initialPitches;
  const audioUrls = pronounciations

  return (
    <div className="step">
      <h2>Step 3: Join</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>Join in with the melody and words.</p>

      <div>
      <MusicalNotes syllables={syllables} initialPitches={pitches} audioUrls={audioUrls} fading={false} alone={false} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step3;
