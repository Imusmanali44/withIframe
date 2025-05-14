import { useState } from "react";
import { useEffect } from "react";
import Configurator from "./components/Configurator";
import { LocalizationProvider } from "./context/LocalizationContext";
import LanguageSelector from "./components/LanguageSelector";
import { useLocalization } from "./context/LocalizationContext";

function AppContent() {
  const [activeStep, setActiveStep] = useState(1);
  const [isExpertMode, setIsExpertMode] = useState(true);
  const { t } = useLocalization();

  const handleToggle = () => {
    setIsExpertMode((prev) => !prev);
    setActiveStep(1);
  };

  useEffect(() => {
    // Clear all localStorage items
    localStorage.clear();
    
    // Alternatively, you can selectively clear only your app's specific items:
    // Object.keys(localStorage).forEach(key => {
    //   // Only clear keys related to your application 
    //   // For example, if all your keys start with a specific prefix
    //   if (key.startsWith('activeProfile_') || 
    //       key.startsWith('groove_') || 
    //       key.startsWith('stoneSize_')) {
    //     localStorage.removeItem(key);
    //   }
    // });

    console.log("localStorage cleared for new session");
  }, []);

  return (
    <div className="max-w-[1450px] mx-auto lg:px-9 pt-5">
      <div className="flex justify-between items-center mb-5">
        <div className="logo">
          <img src="./public/logo.png" alt="Company Logo" className="h-16" />
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <div className="flex items-center">
            <label htmlFor="expertToggle" className="mr-2">
              {t('settings.expertMode')}
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
      </div>
      <Configurator
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        isExpertMode={isExpertMode}
      />
    </div>
  );
}

function App() {
  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
}

export default App;