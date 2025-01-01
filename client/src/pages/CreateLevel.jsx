import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLevel = () => {
    const [sentence, setSentence] = useState(''); // State to store the typed sentence
    const [submittedSentence, setSubmittedSentence] = useState(''); // State to store submitted sentence
    const [apiResponse, setApiResponse] = useState(''); // State to store API response
    const navigate = useNavigate(); 

    const handleSentenceChange = (e) => {
        setSentence(e.target.value); // Update sentence state on input change
    };

    const handleSentenceSubmit = async () => {
        setSubmittedSentence(sentence); // Save submitted sentence
        console.log('Submitted Sentence:', sentence);

        try {
            console.log(sentence);
            const response = await axios.get('/api/processSentence', {
                params: { sentence }
            });

            const apiMessage = response.data.message; 
            setApiResponse(apiMessage);
            console.log('API Response:', response.data);

            // Navigate to Carousel page with the API response
            navigate('/practice', { state: { spellings: response.data.spellings, pronounciations: response.data.pronounciations, pitches: response.data.pitches, phrase: sentence }});
        } catch (error) {
            console.error('Error fetching from API:', error);
            setApiResponse('Failed to fetch API response');
        }
    };

    return (
        <div>
            <h2>Create Your Own Level</h2>

            {/* Sentence Input Section */}
            <div style={{ marginTop: '20px' }}>
                <h3>Type a Sentence</h3>
                <input 
                    type="text" 
                    value={sentence} 
                    onChange={handleSentenceChange} 
                    placeholder="Type your sentence here" 
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleSentenceSubmit}>Submit</button>
            </div>

            {/* Display Submitted Sentence */}
            {submittedSentence && (
                <p><strong>Submitted Sentence:</strong> {submittedSentence}</p>
            )}

            {/* Display API Response */}
            {apiResponse && (
                <p><strong>API Response:</strong> {apiResponse}</p>
            )}
        </div>
    );
};

export default CreateLevel;
