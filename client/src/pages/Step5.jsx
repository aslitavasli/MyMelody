import React, { useEffect } from 'react';
import MusicalNotes from '../components/Notation'

//This step is humming
const Step5 = ({pronounciations, spellings, initialPitches, updatePitches}) => {
 
  const syllables = spellings;
  const pitches = initialPitches;
  const audioUrls = pronounciations

  // const syllables = ["What's", 'for',"din-","ner?"];
  // const initialPitches = [1, 0,0,1];
  // const audioUrls = [
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_0_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_'
  // ];

  return (
    <div className="step">
      <h2>Step 5: Alone</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>Step 4</p>

      <div>
      <MusicalNotes syllables={syllables} initialPitches={pitches} audioUrls={audioUrls} fading={false} alone={true} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step5;
