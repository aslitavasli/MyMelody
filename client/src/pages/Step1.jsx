import React, { useEffect } from 'react';
import MusicalNotes from '../components/Notation'

//This step is humming
const Step1 = ({initialPitches, updatePitches}) => {
  

  const pitches = initialPitches
  console.log('pitches in step 1')
  console.log(initialPitches)
  const syllables = Array(initialPitches.length).fill('hm')

  const audioUrls = Array(initialPitches.length).fill('https://syllablepronounciations.s3.us-east-1.amazonaws.com/hums/')
  // const audioUrls = [
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_0_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
  //   'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_'
  // ];

  return (
    <div className="step">
      <h2>Step 1: Humming</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>This is the description for Step 1.</p>

      <div>

      <MusicalNotes syllables={syllables} initialPitches={initialPitches} audioUrls={audioUrls} fading={false} alone={false} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step1;
