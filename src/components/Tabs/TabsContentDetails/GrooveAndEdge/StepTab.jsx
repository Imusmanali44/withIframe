import { useState, useEffect } from "react";
import WidthDepthSurface from "./WidthDepthSurface";
import { useLocalization } from "../../../../context/LocalizationContext";
import { saveStepConfiguration } from "../../../../utils/pricing";

const stepLeftOptions = [
  {
    name: "Without",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/edge/form/none.svg",
  },
  {
    name: "Step",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/edge/form/normal.svg",
  },
  {
    name: "Milgrain",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/edge/form/perlage.svg",
  },
];

const stepRightOptions = [
  {
    name: "Without",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/edge/form/none.svg",
  },
  {
    name: "Step",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/edge/form/normal.svg",
  },
  {
    name: "Milgrain",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/edge/form/perlage.svg",
  },
];

const StepTab = ({
  activeRing,
  selectedLeftStepOptions,
  setSelectedLeftStepOptions,
  selectedRightStepOptions,
  setSelectedRightStepOptions,
}) => {
  const { t } = useLocalization();
  
  // Helper function to generate storage key based on active ring
  const getStorageKey = (suffix) => {
    return Array.isArray(activeRing) 
      ? `${suffix}_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `${suffix}_${activeRing?.name}`;
  };

  // Initialize optionStepLeft from localStorage or default to "Without"
  const [optionStepLeft, setOptionStepLeft] = useState(() => {
    const storageKey = getStorageKey('optionStepLeft');
    return localStorage.getItem(storageKey) || "Without";
  });

  // Initialize optionStepRight from localStorage or default to "Without"
  const [optionStepRight, setOptionStepRight] = useState(() => {
    const storageKey = getStorageKey('optionStepRight');
    return localStorage.getItem(storageKey) || "Without";
  });

  // Effect to reload states when activeRing changes
  useEffect(() => {
    // Load left step option
    const leftStepKey = getStorageKey('optionStepLeft');
    const savedLeftStep = localStorage.getItem(leftStepKey);
    if (savedLeftStep) setOptionStepLeft(savedLeftStep);
    
    // Load right step option
    const rightStepKey = getStorageKey('optionStepRight');
    const savedRightStep = localStorage.getItem(rightStepKey);
    if (savedRightStep) setOptionStepRight(savedRightStep);
  }, [activeRing]);

  // Save optionStepLeft to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('optionStepLeft');
    localStorage.setItem(storageKey, optionStepLeft);
  }, [optionStepLeft, activeRing]);

  // Save optionStepRight to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('optionStepRight');
    localStorage.setItem(storageKey, optionStepRight);
  }, [optionStepRight, activeRing]);
  
  // Helper function to trigger step pricing update
  const triggerStepPricing = (leftStep, rightStep) => {
    const selectedRing = window.selectedRing || 1; // Default to ring 1 if not set
    const isPairActive = window.pair1 === true;
    
    const stepConfig = {
      left: leftStep,
      right: rightStep
    };

    if (isPairActive && (selectedRing === 1 || selectedRing === 2)) {
      // For pairs, apply step config to both rings
      saveStepConfiguration('ring1', stepConfig);
      saveStepConfiguration('ring2', stepConfig);
    } else {
      // For individual rings, apply only to the selected ring
      const ringKey = `ring${selectedRing}`;
      saveStepConfiguration(ringKey, stepConfig);
    }
  };
  
  // Function to get localized step name
  const getLocalizedStepName = (name) => {
    switch(name) {
      case "Without": return t('grooveAndEdge.options.without');
      case "Step": return t('grooveAndEdge.options.step');
      case "Milgrain": return t('grooveAndEdge.options.milgrain');
      default: return name;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      <label htmlFor="steps" className="block mb-2">
        {t('grooveAndEdge.labels.left')}
      </label>
      <div className="flex items-start space-x-2">
        {stepLeftOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setOptionStepLeft(item.name);
              console.log('Left step changed to:', item.name);
              
              // Trigger pricing update
              triggerStepPricing(item.name, optionStepRight);
              
              window.parent.postMessage(
                {
                  action: "addStep",
                  value: "left",
                  type: item.name,
                  ringKey: Array.isArray(activeRing) 
                    ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
                    : activeRing?.name
                },
                "*"
              );
            }}
            className={`bg-white w-full border ${
              optionStepLeft === item.name
                ? "border-[#205fa8]"
                : "border-[#e1e1e1]"
            }`}
          >
            <span className="text-sm">{getLocalizedStepName(item.name)}</span>
            <img src={item.img} className="mx-auto mt-5" alt={item.name} />
          </button>
        ))}
      </div>
      {optionStepLeft !== "Without" && (
        <WidthDepthSurface
          groove={optionStepLeft}
          selectedOptions={selectedLeftStepOptions}
          setSelectedOptions={setSelectedLeftStepOptions}
          activeRing={activeRing}
        />
      )}

      <div className="border my-10"></div>

      <label htmlFor="steps" className="block mb-2">
        {t('grooveAndEdge.labels.right')}
      </label>
      <div className="flex items-start space-x-2">
        {stepRightOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setOptionStepRight(item.name);
              console.log('Right step changed to:', item.name);
              
              // Trigger pricing update
              triggerStepPricing(optionStepLeft, item.name);
              
              window.parent.postMessage(
                {
                  action: "addStep",
                  value: "right",
                  type: item.name,
                  ringKey: Array.isArray(activeRing) 
                    ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
                    : activeRing?.name
                },
                "*"
              );
            }}
            className={`bg-white w-full border ${
              optionStepRight === item.name
                ? "border-[#205fa8]"
                : "border-[#e1e1e1]"
            }`}
          >
            <span className="text-sm">{getLocalizedStepName(item.name)}</span>
            <img
              src={item.img}
              className="mx-auto mt-5 scale-x-[-1]"
              alt={item.name}
            />
          </button>
        ))}
      </div>

      {optionStepRight !== "Without" && (
        <WidthDepthSurface
          groove={optionStepRight}
          selectedOptions={selectedRightStepOptions}
          setSelectedOptions={setSelectedRightStepOptions}
          activeRing={activeRing}
        />
      )}
    </div>
  );
};

export default StepTab;