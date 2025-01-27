import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Step0 from './MIT Steps/Step0';
import Step1 from './MIT Steps/Step1';
import Step2 from './MIT Steps/Step2';
import Step3 from './MIT Steps/Step3';
import Step4 from './MIT Steps/Step4';
import Step5 from './MIT Steps/Step5';
import Step6 from './MIT Steps/Step6';
import Completed from './MIT Steps/Complete'

const steps = [
  { id: 0, component: (props) => <Step0 {...props} /> }, 
  { id: 1, component: (props) => <Step1 {...props} /> },
  { id: 2, component: (props) => <Step2 {...props}/> },
  { id: 3, component: (props) => <Step3 {...props}/> },
  { id: 4, component: (props) => <Step4 {...props}/> },
  { id: 5, component: (props) => <Step5 {...props}/> },
  { id: 6, component: (props) => <Step6 {...props}/> },
  {id:7, component: (props) => <Completed {...props}/>}
];

const Carousel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [spellings, setSpellings] = useState([]);
  const [pronounciations, setPronounciations] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [phrase, setPhrase] = useState('');


  useEffect(() => {
    const fetchResponse = async () => {
      if (
        location.state?.spellings &&
        location.state?.pronounciations &&
        location.state?.pitches &&
        location.state?.phrase
      ) {
        setSpellings(location.state.spellings);
        setPronounciations(location.state.pronounciations);
        setPitches(location.state.pitches);
        setPhrase(location.state.phrase);
        

       
      } else {
        console.error('Error: Missing data in location.state');
      }
      setIsLoading(false);
    };

    fetchResponse();
  }, [location.state]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const skipEnd = () => {
    setCurrentStep(7);
  };

  const deleteLevel = async ()=> {
    try {
      
      const response = await axios.delete(`/api/deleteLevel/${phrase} `);

      if (response.status === 200) {
        navigate('/levels'); 
      } else {
        console.error('Failed to delete the level');
      }
    } catch (error) {
      console.error('Error deleting the level:', error);
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const updatePitches = (newPitches) => {
    setPitches(newPitches); // Update the pitches state
  };

  
  if (isLoading) {
    return <div>Loading...</div>;
  }


  const handleGoBack = () => {
    navigate('/levels')
};

  return (
    <div className="carousel-container">

        <div className='back-button-container'>
                <button onClick={handleGoBack}>
                    Go Back
                </button>
      </div>
       
      <div className="step-content">
        {(steps[currentStep].id === 0)
          ? steps[currentStep].component({ phrase }) // Pass phrase to Step0
          : steps[currentStep].id === 1
          ? steps[currentStep].component({ initialPitches: pitches, updatePitches: updatePitches }) // Pass pitches to Step1
          : (steps[currentStep].id === 7 && !(!pitches || pitches.length === 0))
          ? steps[currentStep].component({  pronounciations: pronounciations,  spellings: spellings, pitches: pitches, phrase: phrase }) // Pass pitches to Step1
          : steps[currentStep].component({
            pronounciations: pronounciations,  spellings: spellings, initialPitches: pitches, updatePitches: updatePitches })}
      </div>
      <div className="carousel-controls">
        {currentStep !== 0 && <button onClick={prevStep}>Previous</button>}
        {currentStep !== steps.length - 1 && <button onClick={nextStep}>Next</button>}
      </div>

      <div className='skip-button-container'> {currentStep !== 7 && <button onClick={skipEnd}>Skip To End </button>}</div>
      <div className='delete-level-container'> <button onClick={deleteLevel}> Delete Level </button> </div>
    </div>
  );
};

export default Carousel;
