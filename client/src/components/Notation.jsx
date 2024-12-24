import React, { useState, useEffect } from 'react';

const MusicalNotes = ({ syllables, initialPitches, audioUrls }) => {
  const [pitches, setPitches] = useState(initialPitches);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audio, setAudio] = useState(null); // Initially no audio is set
  const [audioSequenceEnded, setAudioSequenceEnded] = useState(false)
  const [beginningBeforeStart, setBeginningBeforeStart] = useState(true)
  const [showTap, setShowTap] = useState(false)

  if (syllables.length !== pitches.length) {
    console.error('Syllables and pitches arrays must have the same length');
    return null;
  }

  const svgWidth = 50 + syllables.length * 100;

  const togglePitch = (index) => {
    if (!isEditing) return; // Only toggle pitch if editing mode is active
    const newPitches = [...pitches];
    newPitches[index] = newPitches[index] === 1 ? 0 : 1; // Toggle between high (1) and low (0)
    setPitches(newPitches);
  };

  const handlePlayStop = () => {

    //if the audio is currently playing, you stop it.

    if (isPlaying) { //audio is currently playing when the user pressed the button
      
      //stop the current audio 
      if (audio) {
        audio.pause();
        
      }
      setIsPlaying(false);

      return
    }

    //the user pressed play again, so should start from the beginnging
    if (audioSequenceEnded){
      setCurrentAudioIndex(0); // Reset to the first audio in the sequence, if audioSequence has ended
      setAudioSequenceEnded(false)
      setIsPlaying(true)
      setBeginningBeforeStart(false)
      
      setShowTap(true)
      // Hide "Tap" after 50ms
      setTimeout(() => {
      setShowTap(false);
      }, 250);

      return
    }

      //the user has pressed play, but the audio sequence hasn't ended yet
    
    // Start playing the audio sequence
    setIsPlaying(true)
    
    setShowTap(true)
    // Hide "Tap" after 50ms
    setTimeout(() => {
    setShowTap(false);
    }, 250);

    audio.play()
    setBeginningBeforeStart(false)
  
  
  };

  const playAudioSequence = (url, pitch) => {
    setShowTap(true)
    
    setTimeout(() => {
    setShowTap(false);
    }, 250);

    setTimeout(() => {
      const newAudio = new Audio(url+pitch+'.mp3');
    setAudio(newAudio);
    newAudio.play();
    newAudio.addEventListener('ended', handleAudioEnd);
    }, 100); // CHANGE SETTINGS

    
  };

  const handleAudioEnd = () => {
    // move to the next audio in the sequence, unless you have reached the last audio
    if (currentAudioIndex < audioUrls.length - 1 ) {
      setCurrentAudioIndex(currentAudioIndex + 1);
        setShowTap(true)
        
        setTimeout(() => {
          setShowTap(false);
          }, 250);

    } else { //you have finished the last audio
      setIsPlaying(false); 
      setAudioSequenceEnded(true)
      setBeginningBeforeStart(true)

    }
  };

  useEffect(() => {
    if (currentAudioIndex < audioUrls.length ) {
      // Only play the next audio if the index is valid
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnd); // Cleanup previous event listener
      }
      playAudioSequence(audioUrls[currentAudioIndex], pitches[currentAudioIndex]);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnd); // Cleanup event listener
      }
    };
  }, [currentAudioIndex]); // Only listen to changes in currentAudioIndex

  return (
    <div className="musical-notes-container">
      <h1>Musical Notes Visualizer</h1>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Disable Edit' : 'Enable Edit'}
      </button>

      <div>
        {/* Single Play/Stop button */}
        <button onClick={handlePlayStop}>
        {audioSequenceEnded ? 'Play again' : isPlaying ? 'Stop' : 'Continue'}
        </button>
      </div>

      <svg className="musical-staff" viewBox={`0 0 ${svgWidth} 200`}>;
        {/* Draw connecting lines */}
        {syllables.map((_, index) => {

          var isCurrentNote = (index + 1  == currentAudioIndex);
          
          var color = 'white'
          if (isCurrentNote) {
            if (!audioSequenceEnded && !beginningBeforeStart) {
              color = 'green';
            } else if (beginningBeforeStart) {
              color = 'white'; 
            }
          }

          if (index < syllables.length - 1) {

            const x1 = 50 + index * 100;
            const y1 = 100 - pitches[index] * 40;
            const x2 = 50 + (index + 1) * 100;
            const y2 = 100 - pitches[index + 1] * 40;

            return (
              <line
                key={`line-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}

                stroke={color}
                fill={color}
                strokeWidth="2"
                strokeDasharray="5,5"
                className="note-line"
              />
            );
          }
          return null;
        })}

        {/* Draw notes */}
        {syllables.map((syllable, index) => {

           var isCurrentNote = (index  == currentAudioIndex );
        
          var color = 'white'
         
          if (isCurrentNote) {
            if (!audioSequenceEnded && !beginningBeforeStart) {
              color = 'green';
            } else if (beginningBeforeStart) {
              color = 'white'; // Explicitly set white when at the beginning before start
            }
          }

          const x = 50 + index * 100;
          const y = 100 - pitches[index] * 40;

          return (
            <g key={index} onClick={() => togglePitch(index)}>
              <circle cx={x} cy={y} r={10} className="note" fill={color} />
              <text x={x} y={y - 15} textAnchor="middle" className="note-label" fill={color}>
                {syllable}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Flashing TAP button */}
      
        <button className="tap-button"  style={{
        backgroundColor: showTap ? "green" : "white",
        color: showTap ? "white" : "black", // Optional for text contrast
        }}>
          TAP
        </button>
     
    </div>
  );
};

const App = () => {
  const syllables = ["What's", 'for',"din-","ner?"];
  const initialPitches = [1, 0,0,1];
  const audioUrls = [
    'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_0_',
    'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
    'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_',
    'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/hello/syllable_1_'
  ];

  return (
    <div>
      <MusicalNotes syllables={syllables} initialPitches={initialPitches} audioUrls={audioUrls} />
    </div>
  );
};

export default App;
