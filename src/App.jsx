import { useState } from "react";
import Configurator from "./components/Configurator";

function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [isExpertMode, setIsExpertMode] = useState(true);

  const handleToggle = () => {
    setIsExpertMode((prev) => !prev);
    setActiveStep(1);
  };

  return (
    <div className="max-w-[1450px] mx-auto lg:px-9 pt-5">
      <div className="flex justify-between items-center mb-5">
        <div className="logo">
          <img src="./public/logo.png" alt="Company Logo" className="h-16" />
        </div>
        <div className="flex items-center">
          <label htmlFor="expertToggle" className="mr-2">
            Expert Mode:
          </label>
          <input
            id="expertToggle"
            type="checkbox"
            checked={isExpertMode}
            onChange={handleToggle}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </div>
      </div>
      <Configurator
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        isExpertMode={isExpertMode}
      />
    </div>
  );
}

export default App;