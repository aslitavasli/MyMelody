import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  console.log('pitches in step', currentStep)
  console.log(pitches)
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
        

        console.log('Location State:', location.state);
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

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const updatePitches = (newPitches) => {
    setPitches(newPitches); // Update the pitches state
    console.log('Updated Pitches:', newPitches); // Log the updated pitches
  };

  
  if (isLoading) {
    return <div>Loading...</div>;
  }


  const handleGoBack = (e) => {
    navigate('/menu')
};

  return (
    <div className="carousel-container">

        <div style={{ marginTop: '20px' }}>
                <button onClick={handleGoBack} style={{ backgroundColor: '#f0f0f0', padding: '10px', border: '1px solid #ccc' }}>
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
    </div>
  );
};

export default Carousel;
