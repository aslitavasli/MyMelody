import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const steps = [
    // {id: 0,   component: <Step0/> },
  { id: 1, component: <Step1 /> },
  { id: 2, component: <Step2 /> },
  { id: 3, component: <Step3 /> },
  { id: 4, component: <Step4 /> },
];

const Carousel = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="carousel-container">
      <div className="step-content">
        {steps[currentStep].component}
      </div>
      <div className="carousel-controls">
        <button onClick={prevStep} disabled={currentStep === 0}>Previous</button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default Carousel;
