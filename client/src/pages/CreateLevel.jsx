import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLevel = () => {
    const [sentence, setSentence] = useState(''); // State to store the typed sentence
    const [submittedSentence, setSubmittedSentence] = useState(''); // State to store submitted sentence
    const [error, setError] = useState(''); // State to store validation error message
    const navigate = useNavigate(); 

    const handleSentenceChange = (e) => {
        setSentence(e.target.value); // Update sentence state on input change
        setError(''); // Clear any previous error
    };

    const handleGoBack = () => {
        navigate('/menu');
    };

    // Function to count syllables in a sentence
    const countSyllables = (text) => {
        const words = text.toLowerCase().split(/\s+/);
        let syllableCount = 0;

        words.forEach(word => {
            // Match vowels (a, e, i, o, u) and count syllables
            const matches = word.match(/[aeiouy]+/g);
            if (matches) syllableCount += matches.length;
        });

        return syllableCount;
    };

    const validateSentence = (sentence) => {
        // Check for non-letter characters (excluding spaces)
        if (/[^a-zA-Z\s]/.test(sentence)){
            return 'Sentence should not include any special characters!';
        }

        // Check syllable count
        const syllableCount = countSyllables(sentence);
        if (syllableCount > 7) {
            return `Sentence has too many syllables. Found ${syllableCount}, but should be 7 or less.`;
        }

        if (syllableCount < 2) {
            return `Sentence is monosyllable, but should be at least 2!`;
        }
        return '';
    };

    const handleSentenceSubmit = async () => {
        const validationError = validateSentence(sentence);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmittedSentence(sentence); // Save submitted sentence

        try {
            const response = await axios.get('/api/processSentence', {
                params: { sentence }
            });

            if (!response.data.error) {
                // Navigate to Carousel page with the API response
                navigate('/practice', { 
                    state: { 
                        spellings: response.data.spellings, 
                        pronounciations: response.data.pronounciations, 
                        pitches: response.data.pitches, 
                        phrase: sentence 
                    }
                });
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.log(error);
            setError("An error occurred, please try again (or another sentence)!");
        }
    };

    return (
        <div className="create-level-container">
            <h1>Create Your Own Level</h1>

            {/* Sentence Input Section */}
            <div className="input-section">
                <h3>Type a sentence in English!</h3>
                <input className='input-bar'
                    type="text" 
                    value={sentence} 
                    onChange={handleSentenceChange} 
                    placeholder="Type your sentence here" 
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleSentenceSubmit}>Submit</button>
                <h4>For MIT purposes, your sentence should be around 2-7 syllables. This version of MyMelody doesn't support words that don't exist in the Oxford Dictionary (like names)!</h4>
            </div>

            {/* Display Validation Error */}
            {error && (
                <p className="error-message"><strong>Error:</strong> {error}</p>
            )}

            {/* Display Submitted Sentence */}
            {submittedSentence && (
                <p className="submitted-sentence"><strong>Submitted Sentence:</strong> {submittedSentence}</p>
            )}

            <div className="back-button-container">
                <button onClick={handleGoBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default CreateLevel;