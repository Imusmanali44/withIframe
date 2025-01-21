import { useState, useRef, useEffect } from "react";
import { Tabs } from "../Tabs/Tabs";
import TabContent from "../Tabs/TabsContent";
import { TopBar } from "./TopBar";
import TabContentFooter from "../Tabs/TabContentFooter";
import ConfiguratorFooter from "./Footer";
import { AppContext } from "./config";

window.pair1 = 0
window.selectedRing = 1;
window.ringsLength = 2
const Configurator = ({ activeStep, setActiveStep, isExpertMode }) => {
  
  const [isPair, setIsPair] = useState({
    pair1: true,
    pair2: false,
  });
  const [rings, setRings] = useState([
    { type: "Wedding", id: 1, name: "Ring 1" },
    { type: "Wedding", id: 2, name: "Ring 2" },
  ]);
  const [activeRing, setActiveRing] = useState(null);
  const iframeRef = useRef(null);

  const handleNext = () => {
    if (isExpertMode ? activeStep < 6 : activeStep < 4) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Ensure the message comes from a trusted source (e.g., your iframe)
      if (event.origin !== window.location.origin) return;
  
      const { action, payload } = event.data;
  
      if (action === "removeSecondModel") {
        // Update the state or handle the message as needed
        console.log("Received message from iframe:", payload);
        setIsPair((prev) => ({ ...prev, pair1: payload.pair1 }));
      }
  
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(event.data, "*");
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Add useEffect to watch for changes in isPair
  useEffect(() => {
    console.log("Pair status updated:", isPair);
    window.pair1 = isPair.pair1
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ action: 'updatePairStatus',value: isPair }, "*");
    }
  }, [isPair]); // Trigger whenever isPair changes

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
        setIsPair={setIsPair}
        isPair={isPair}
        rings={rings}
        setRings={setRings}
        activeRing={activeRing}
        setActiveRing={setActiveRing}
      />

      <div className="flex flex-col lg:flex-row bg-[#f9f9fa] gap-2">
        <div className="lg:w-1/2 flex flex-col">
          <div className="h-[275px] lg:h-[590px] mb-auto">
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
            setIsPair={setIsPair}
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
