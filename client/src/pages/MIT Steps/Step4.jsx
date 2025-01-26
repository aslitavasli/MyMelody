import React, { useEffect } from 'react';
import MusicalNotes from '../../components/Notation'

//This step is humming
const Step4 = ({pronounciations, spellings, initialPitches, updatePitches}) => {
  const syllables = spellings;
  const pitches = initialPitches;
  const audioUrls = pronounciations

  return (
    <div className="step">
      <h2>Step 4: Fading</h2>
     
      <p>Great, continue singing...</p>

      <div>
      <MusicalNotes syllables={syllables} initialPitches={pitches} audioUrls={audioUrls} fading={true} alone={false} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step4;
