import { useState, useRef, useEffect } from "react";
import { Tabs } from "../Tabs/Tabs";
import { TabContent } from "../Tabs/TabContent";
import { TopBar } from "./TopBar";
import TabContentFooter from "../Tabs/TabContentFooter";
import ConfiguratorFooter from "./Footer";

const Configurator = ({ activeStep, setActiveStep, isExpertMode }) => {
  const [isPair, setIsPair] = useState(true);
  const [rings, setRings] = useState([
    { type: "Wedding", id: 1, name: "Ring 1" },
    { type: "Wedding", id: 2, name: "Ring 2" },
  ]);
  const [activeRing, setActiveRing] = useState(null);
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
        iframeRef.current.contentWindow.postMessage(event.data, "*");
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <div>
      <Tabs
        setStep={setActiveStep}
        handleBack={handleBack}
        handleNext={handleNext}
        step={activeStep}
        isExpertMode={isExpertMode}
      />

      <TopBar
        toggleIsPair={toggleIsPair}
        isPair={isPair}
        rings={rings}
        setRings={setRings}
        activeRing={activeRing}
        setActiveRing={setActiveRing}
      />

      <div className="flex flex-col lg:flex-row bg-[#f9f9fa] gap-2">
        <div className="lg:w-1/2">
          <div className="h-[275px] lg:h-[590px]">
            <iframe
              ref={iframeRef}
              id="myIframe"
              src="/three.html"
              width="100%"
              height="100%"
              style={{ border: "none", overflow: "hidden" }}
              title="embedded-content"
            />
          </div>

          <ConfiguratorFooter />
        </div>

        <div className="lg:w-1/2 p-4 lg:p-0 flex flex-col">
          <TabContent
            isExpertMode={isExpertMode}
            step={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            isPair={isPair}
            toggleIsPair={toggleIsPair}
            rings={rings}
            activeRing={activeRing}
          />
          <TabContentFooter />
        </div>
      </div>
    </div>
  );
};

export default Configurator;
