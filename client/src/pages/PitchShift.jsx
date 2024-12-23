import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import axios from 'axios';

const PitchShift = () => {
    const [player, setPlayer] = useState(null);
    const [pitchShift, setPitchShift] = useState(null);
    const [audioUrl, setAudioUrl] = useState(''); // State to store the S3 audio URL
    const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing

    useEffect(() => {
        if (audioUrl) {
            // Create a new Tone.Player when audioUrl is set
            const newPlayer = new Tone.Player(audioUrl).toDestination();
            setPlayer(newPlayer);

            // Create a PitchShift effect and connect it to the player
            const pitchEffect = new Tone.PitchShift().toDestination();
            newPlayer.connect(pitchEffect);
            setPitchShift(pitchEffect);
        }
    }, [audioUrl]);

    const playWithPitch = (semitones) => {
        if (player && pitchShift) {
            pitchShift.pitch = semitones; // Set pitch in semitones
            player.start();
        }
    };

    const handleAudioUrlChange = (e) => {
        setAudioUrl(e.target.value); // Update audio URL state
    };

    const togglePlay = () => {
        const audioElement = document.getElementById('audio-player');
        if (audioElement) {
            if (audioElement.paused) {
                audioElement.play();
                setIsPlaying(true);
            } else {
                audioElement.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <div>
            <h2>Pitch Shift Audio Player</h2>
            <button onClick={() => playWithPitch(2)}>Pitch +2 Semitones</button>
            <button onClick={() => playWithPitch(-2)}>Pitch -2 Semitones</button>

            {/* S3 Audio URL Input Section */}
            <div style={{ marginTop: '20px' }}>
                <h3>Enter S3 Audio URL</h3>
                <input
                    type="text"
                    value={audioUrl}
                    onChange={handleAudioUrlChange}
                    placeholder="Enter the S3 URL here"
                    style={{ marginRight: '10px' }}
                />
                <button onClick={togglePlay}>
                    {isPlaying ? 'Pause Audio' : 'Play Audio'}
                </button>
            </div>

            {/* Audio Element */}
            {audioUrl && (
                <audio id="audio-player" src={'https://syllablepronounciations.s3.us-east-1.amazonaws.com/audio/happiness/syllable_2.mp3'} preload="auto" />
            )}
        </div>
    );
};

export default PitchShift;


// import React, { useState } from 'react';
// import * as Tone from 'tone';
// import axios from 'axios';

// const PitchShift = () => {
//     const [audioBuffer, setAudioBuffer] = useState(null);
//     const [player, setPlayer] = useState(null);
//     const [pitchShift, setPitchShift] = useState(null);
//     const [sentence, setSentence] = useState(''); // State to store the typed sentence
//     const [submittedSentence, setSubmittedSentence] = useState(''); // State to store submitted sentence
//     const [apiResponse, setApiResponse] = useState(''); // State to store API response
//     const [audioUrl, setAudioUrl] = useState(''); // State to store the S3 audio URL
//     const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing

//     // Fetch audio from an S3 bucket and load it into Tone.js
//     const fetchAudioFromS3 = async (url) => {
//         try {
//             const response = await axios.get(url, { responseType: 'arraybuffer' });
//             const arrayBuffer = response.data;
//             const buffer = await Tone.getContext().rawContext.decodeAudioData(arrayBuffer);

//             const newPlayer = new Tone.Player(buffer).toDestination();
//             setPlayer(newPlayer);

//             // Create a PitchShift effect
//             const pitchEffect = new Tone.PitchShift().toDestination();
//             newPlayer.connect(pitchEffect);
//             setPitchShift(pitchEffect);
//         } catch (error) {
//             console.error('Error fetching audio:', error);
//         }
//     };

//     const playWithPitch = (semitones) => {
//         if (player && pitchShift) {
//             pitchShift.pitch = semitones; // Set pitch in semitones
//             player.start();
//         }
//     };

//     const handleSentenceChange = (e) => {
//         setSentence(e.target.value); // Update sentence state on input change
//     };

//     const handleSentenceSubmit = async () => {
//         setSubmittedSentence(sentence); // Save submitted sentence
//         console.log('Submitted Sentence:', sentence);

//         try {
//             console.log(sentence);
//             const response = await axios.get('/api/processSentence', {
//                 params: { sentence }
//             });

//             setApiResponse(response.data.message); // Assuming the API returns a 'message' field
//             console.log('API Response:', response.data);
//         } catch (error) {
//             console.error('Error fetching from API:', error);
//             setApiResponse('Failed to fetch API response');
//         }
//     };

//     const handleAudioUrlChange = (e) => {
//         setAudioUrl(e.target.value); // Update audio URL state
//     };

//     const handleAudioUrlSubmit = () => {
//         if (audioUrl) {
//             fetchAudioFromS3(audioUrl); // Fetch and load audio from the S3 URL
//         }
//     };

//      // Toggle play/pause state
//      const togglePlay = () => {
//         const audioElement = document.getElementById('audio-player');
//         if (audioElement) {
//             if (audioElement.paused) {
//                 audioElement.play();
//                 setIsPlaying(true);
//             } else {
//                 audioElement.pause();
//                 setIsPlaying(false);
//             }
//         }
//     };


//     return (
//         <div>
//             <h2>Pitch Shift Audio Player</h2>
//             <button onClick={() => playWithPitch(2)}>Pitch +2 Semitones</button>
//             <button onClick={() => playWithPitch(-2)}>Pitch -2 Semitones</button>
            
//             {/* S3 Audio URL Input Section */}
//             <div style={{ marginTop: '20px' }}>
//                 <h3>Enter S3 Audio URL</h3>
//                 <input
//                     type="text"
//                     value={audioUrl}
//                     onChange={handleAudioUrlChange}
//                     placeholder="Enter the S3 URL here"
//                     style={{ marginRight: '10px' }}
//                 />
//                 <button onClick={handleAudioUrlSubmit}>Fetch Audio</button>
//             </div>

//                 {/* S3 Audio URL Input Section */}
//                 <div style={{ marginTop: '20px' }}>
//                 <h3>Enter S3 Audio URL</h3>
//                 <input
//                     type="text"
//                     value={audioUrl}
//                     onChange={handleAudioUrlChange}
//                     placeholder="Enter the S3 URL here"
//                     style={{ marginRight: '10px' }}
//                 />
//                 <button onClick={togglePlay}>
//                     {isPlaying ? 'Pause Audio' : 'Play Audio'}
//                 </button>
//             </div>

//             {/* Audio Element */}
//             {audioUrl && (
//                 <audio id="audio-player" src={audioUrl} preload="auto" />
//             )}

//             {/* Sentence Input Section */}
//             <div style={{ marginTop: '20px' }}>
//                 <h3>Type a Sentence</h3>
//                 <input 
//                     type="text" 
//                     value={sentence} 
//                     onChange={handleSentenceChange} 
//                     placeholder="Type your sentence here" 
//                     style={{ marginRight: '10px' }}
//                 />
//                 <button onClick={handleSentenceSubmit}>Submit</button>
//             </div>

//             {/* Display Submitted Sentence */}
//             {submittedSentence && (
//                 <p><strong>Submitted Sentence:</strong> {submittedSentence}</p>
//             )}

//             {/* Display API Response */}
//             {apiResponse && (
//                 <p><strong>API Response:</strong> {apiResponse}</p>
//             )}
//         </div>
//     );
// };

// export default PitchShift;



// // import React, { useState } from 'react';
// // import * as Tone from 'tone';
// // import axios from 'axios';

// // const PitchShift = () => {
// //     const [audioBuffer, setAudioBuffer] = useState(null);
// //     const [player, setPlayer] = useState(null);
// //     const [pitchShift, setPitchShift] = useState(null);
// //     const [sentence, setSentence] = useState(''); // State to store the typed sentence
// //     const [submittedSentence, setSubmittedSentence] = useState(''); // State to store submitted sentence
// //     const [apiResponse, setApiResponse] = useState(''); // State to store API response

// //     const fetchAudio = async () => {
// //         try {
// //             const response = await axios.get('/audio');
// //             if (!response.ok) throw new Error('Failed to fetch audio');
// //             const arrayBuffer = await response.arrayBuffer();
// //             const buffer = await Tone.getContext().rawContext.decodeAudioData(arrayBuffer);

// //             const newPlayer = new Tone.Player(buffer).toDestination();
// //             setPlayer(newPlayer);

// //             // Create a PitchShift effect
// //             const pitchEffect = new Tone.PitchShift().toDestination();
// //             newPlayer.connect(pitchEffect);
// //             setPitchShift(pitchEffect);
// //         } catch (error) {
// //             console.error(error);
// //         }
// //     };

// //     const playWithPitch = (semitones) => {
// //         if (player && pitchShift) {
// //             pitchShift.pitch = semitones; // Set pitch in semitones
// //             player.start();
// //         }
// //     };

// //     const handleSentenceChange = (e) => {
// //         setSentence(e.target.value); // Update sentence state on input change
// //     };

// //     const handleSentenceSubmit = async () => {
// //         setSubmittedSentence(sentence); // Save submitted sentence
// //         console.log('Submitted Sentence:', sentence);

// //         try {
// //             console.log(sentence)
// //             const response = await axios.get('/api/processSentence', {
// //                 params: { sentence }
// //               });

// //             setApiResponse(response.data.message); // Assuming the API returns a 'message' field
// //             console.log('API Response:', response.data);
// //         } catch (error) {
// //             console.error('Error fetching from API:', error);
// //             setApiResponse('Failed to fetch API response');
// //         }
// //     };

// //     return (
// //         <div>
// //             <h2>Pitch Shift Audio Player</h2>
// //             <button onClick={fetchAudio}>Fetch Audio</button>
// //             <button onClick={() => playWithPitch(2)}>Pitch +2 Semitones</button>
// //             <button onClick={() => playWithPitch(-2)}>Pitch -2 Semitones</button>
            
// //             {/* Sentence Input Section */}
// //             <div style={{ marginTop: '20px' }}>
// //                 <h3>Type a Sentence</h3>
// //                 <input 
// //                     type="text" 
// //                     value={sentence} 
// //                     onChange={handleSentenceChange} 
// //                     placeholder="Type your sentence here" 
// //                     style={{ marginRight: '10px' }}
// //                 />
// //                 <button onClick={handleSentenceSubmit}>Submit</button>
// //             </div>

// //             {/* Display Submitted Sentence */}
// //             {submittedSentence && (
// //                 <p><strong>Submitted Sentence:</strong> {submittedSentence}</p>
// //             )}

// //             {/* Display API Response */}
// //             {apiResponse && (
// //                 <p><strong>API Response:</strong> {apiResponse}</p>
// //             )}
// //         </div>
// //     );
// // };

// // export default PitchShift;
