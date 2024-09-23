import { useState, useRef, useEffect } from "react";
import { Tabs } from "../Tabs/Tabs";
import { TabContent } from "../Tabs/TabContent";
import { TopBar } from "./TopBar";

const Configurator = ({ activeStep, setActiveStep, isExpertMode }) => {
  const [isPair, setIsPair] = useState(true);
  const [rings, setRings] = useState([
    { type: "Wedding", id: 1, name: "Ring 1" },
    { type: "Wedding", id: 2, name: "Ring 2" },
  ]);

  const iframeRef = useRef(null); // Create a reference for the iframe

  const handleNext = () => {
    if (isExpertMode ? activeStep < 6 : activeStep < 4) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const toggleIsPair = () => {
    setIsPair((prev) => !prev);
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Handle messages from the Profile component
  useEffect(() => {
    const handleMessage = (event) => {
      // Optional: Check event.origin to ensure the message is from a trusted source
      // console.log('Message received from Profile:', event.data);
      
      // Send message to iframe if it's loaded
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(event.data, '*');
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <Tabs
        setStep={setActiveStep}
        handleBack={setActiveStep}
        handleNext={handleNext}
        step={activeStep}
        isExpertMode={isExpertMode}
      />

      <TopBar
        toggleIsPair={toggleIsPair}
        isPair={isPair}
        rings={rings}
        setRings={setRings}
      />

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gray-300" style={{ height: '80vh' }}>
          <iframe 
            ref={iframeRef} // Attach the ref here
            id="myIframe"
            src="threejs/index.html"  
            width="100%" 
            height="100%" 
            style={{ border: "none", overflow: "hidden" }}
            title="embedded-content"
          />
        </div>

        <div className="lg:w-1/2">
          <TabContent
            isExpertMode={isExpertMode}
            step={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            isPair={isPair}
            toggleIsPair={toggleIsPair}
          />
        </div>
      </div>
    </div>
  );
};

export default Configurator;
