import { useState } from 'react';
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

    const handleGoBack = () => {
        navigate('/menu')
    };

    const handleSentenceSubmit = async () => {
        setSubmittedSentence(sentence); // Save submitted sentence
        

        try {
          
            const response = await axios.get('/api/processSentence', {
                params: { sentence }
            });

            const apiMessage = response.data.message; 
            setApiResponse(apiMessage);
           

            // Navigate to Carousel page with the API response
            navigate('/practice', { state: { spellings: response.data.spellings, pronounciations: response.data.pronounciations, pitches: response.data.pitches, phrase: sentence }});
        } catch (error) {
            console.log(error)
            setApiResponse('Failed to fetch API response');
        }
    };

    return (
        <div className="create-level-container">
            <h1>Create Your Own Level</h1>

            {/* Sentence Input Section */}
            <div className="input-section">
                <h3>Type a sentence in English! </h3>
                <input className='input-bar'
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
                <p className="submitted-sentence"><strong>Submitted Sentence:</strong> {submittedSentence}</p>
            )}

            {/* Display API Response */}
            {apiResponse && (
                <p><strong>API Response:</strong> {apiResponse}</p>
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
