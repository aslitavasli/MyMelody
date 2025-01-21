import React, { useEffect } from 'react';
import MusicalNotes from '../../components/Notation'

//This step is humming
const Step2 = ({pronounciations, spellings, initialPitches, updatePitches}) => {
 
  console.log('pitches in step 2')
  console.log(initialPitches)


  console.log('sp in step 2')
  console.log(spellings)

  console.log(pronounciations)

  const syllables = pronounciations
  const audioUrls = spellings
  const pitches = initialPitches

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
      <h2>Step 2: Listen and Tap</h2>
      {/* <img src="/assets/images/step1.png" alt="Step 1 Visual" /> */}
      <p>Ideally, repeat this step Twice.</p>

      <div>
      <MusicalNotes syllables={spellings} initialPitches={initialPitches} audioUrls={pronounciations} fading={false} alone={false} updatePitches={updatePitches}/>
    </div>

    </div>
  );
};

export default Step2;
