import React, { useState, useEffect } from 'react';

const MusicalNotes = ({ syllables, initialPitches, audioUrls, fading, alone, updatePitches }) => {
  const [pitches, setPitches] = useState(initialPitches);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(-1);
  const [audio, setAudio] = useState(null); // Initially no audio is set
  const [audioSequenceEnded, setAudioSequenceEnded] = useState(false)
  const [beginningBeforeStart, setBeginningBeforeStart] = useState(true)
  const [showTap, setShowTap] = useState(false)
  

  if (syllables.length !== pitches.length) {
    console.error('Syllables and pitches arrays must have the same length');
    return null;
  }

  if (fading){
    var fadeStartingIndex = Math.ceil(syllables.length / 2);
  }

  if (alone){
    var fadeStartingIndex = 0;
  }

  const svgWidth = 50 + syllables.length * 100;
  const svgHeight =  50 + syllables.length * 30;

  const togglePitch = (index) => {
    if (!isEditing) return; // Only toggle pitch if editing mode is active
    const newPitches = [...pitches];
    newPitches[index] = newPitches[index] === 1 ? 0 : 1; // Toggle between high (1) and low (0)
    updatePitches(newPitches)
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

    //FIRST PLAY 
    if (beginningBeforeStart){
      setCurrentAudioIndex(0)
      setIsPlaying(true)
      setBeginningBeforeStart(false)
      
      setShowTap(true)
      // Hide "Tap" after 50ms
      setTimeout(() => {
      setShowTap(false);
      }, 250);

    }


    if (audio){
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
      }
  
  };

  const playAudioSequence = (url, pitch) => {
    console.log('yay')
    setShowTap(true)
    
    setTimeout(() => {
    setShowTap(false);
    }, 250);


    setTimeout(() => {
    
    if (!beginningBeforeStart){
       // Play the appropriate piano sound
      if (pitch === 1) {
        const highPitchAudio = new Audio('https://syllablepronounciations.s3.us-east-1.amazonaws.com/piano/high_pitch_piano.mp3');
        highPitchAudio.play();
      } else {
        const lowPitchAudio = new Audio('https://syllablepronounciations.s3.us-east-1.amazonaws.com/piano/low_pitch_piano.mp3');
        lowPitchAudio.play();
      }
    } 
    console.log('uil')
    console.log(url)
      console.log(url+pitch+'.mp3')
      const newAudio = new Audio(url+pitch+'.mp3'); 
      console.log(newAudio)
      if ((currentAudioIndex >= fadeStartingIndex)){
        newAudio.volume = 0
      }
    setAudio(newAudio);
    newAudio.play();
    newAudio.addEventListener('ended', handleAudioEnd);
    }, 100); // CHANGE SETTINGS

    
  };

  const handleAudioEnd = () => {
    console.log('curr audio:', currentAudioIndex)
    // move to the next audio in the sequence, unless you have reached the last audio
    if (currentAudioIndex < audioUrls.length -1) {
      console.log('i happen')
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
    if (currentAudioIndex < audioUrls.length) {
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
    <div className='test'>
    <div className="musical-notes-container">
      
      <div className='musical-notes-buttons'>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Disable Edit' : 'Enable Edit'}
      </button>
      
        {/* Single Play/Stop button */}
        <button onClick={handlePlayStop}>
        {audioSequenceEnded ? 'Play again' : beginningBeforeStart? 'Start': isPlaying ? 'Stop' : 'Continue'}
        </button>
      </div>
      </div>
      <svg className="musical-staff" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>;
        {/* Draw connecting lines */}
        {syllables.map((_, index) => {

          var isCurrentNote = (index + 1  == currentAudioIndex);
          
          var color = 'white'
          if (isCurrentNote) {
            if (!audioSequenceEnded && !beginningBeforeStart) {
              color = '#38ed83';
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
              color = '#38ed83';
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
        backgroundColor: (showTap && !beginningBeforeStart) ? "#38ed83" : "white",
        color: (showTap && !beginningBeforeStart) ? "white" : "black", // Optional for text contrast
        }}>
          TAP YOUR DESK
        </button>
     
   
    </div>
  );
};

export default MusicalNotes;
