import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';

const steps = [
  { id: 0, component: (props) => <Step0 {...props} /> }, 
  { id: 1, component: (props) => <Step1 {...props} /> },
  { id: 2, component: (props) => <Step2 {...props}/> },
  { id: 3, component: (props) => <Step3 {...props}/> },
  { id: 4, component: (props) => <Step4 {...props}/> },
  { id: 5, component: (props) => <Step5 {...props}/> },
  { id: 6, component: () => <Step6 /> },
];

const Carousel = () => {
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

  return (
    <div className="carousel-container">
      <div className="step-content">
        {steps[currentStep].id === 0
          ? steps[currentStep].component({ phrase }) // Pass phrase to Step0
          : steps[currentStep].id === 1
          ? steps[currentStep].component({ initialPitches: pitches, updatePitches: updatePitches }) // Pass pitches to Step1
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
