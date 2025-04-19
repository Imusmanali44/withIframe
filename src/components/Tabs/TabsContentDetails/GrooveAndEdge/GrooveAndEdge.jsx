import { useState, useEffect } from "react";
import StepTab from "./StepTab";
import StepGroove from "./StepGroove";
import IsPair from "../../../shared/IsPair";

export const GrooveAndEdge = ({rings, isPair, setIsPair, activeRing }) => {
  // Use localStorage for activeTab
  const [activeTab, setActiveTab] = useState(() => {
    // Create a storage key based on the active ring
    const storageKey = Array.isArray(activeRing) 
      ? `activeTab_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `activeTab_${activeRing?.name}`;
    
    // Try to get from localStorage or default to "grooves"
    return localStorage.getItem(storageKey) || "grooves";
  });

  const handleOptionClick = (optionType, optionValue) => {
    setSelectedGrooveOptions((prev) => ({
      ...prev,
      [optionType]: optionValue,
    }));
    console.log(`Groove ${optionType} changed to:`, optionValue);
  };

  // Initialize selectedGrooveOptions from localStorage or default values
  const [selectedGrooveOptions, setSelectedGrooveOptions] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `grooveOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `grooveOptions_${activeRing?.name}`;
    
    const savedOptions = localStorage.getItem(storageKey);
    return savedOptions ? JSON.parse(savedOptions) : {
      width: {
        name: "0.20 mm",
        value: "0.20",
      },
      depth: {
        name: "0.20 mm",
        value: "0.20",
      },
      surface: {
        name: "Polished",
        value: "polished",
      },
    };
  });

  // Initialize selectedLeftStepOptions from localStorage or default values
  const [selectedLeftStepOptions, setSelectedLeftStepOptions] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `leftStepOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `leftStepOptions_${activeRing?.name}`;
    
    const savedOptions = localStorage.getItem(storageKey);
    return savedOptions ? JSON.parse(savedOptions) : {
      width: {
        name: "0.20 mm",
        value: "0.20",
      },
      depth: {
        name: "0.20 mm",
        value: "0.20",
      },
      surface: {
        name: "Polished",
        value: "polished",
      },
    };
  });

  // Initialize selectedRightStepOptions from localStorage or default values
  const [selectedRightStepOptions, setSelectedRightStepOptions] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `rightStepOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `rightStepOptions_${activeRing?.name}`;
    
    const savedOptions = localStorage.getItem(storageKey);
    return savedOptions ? JSON.parse(savedOptions) : {
      width: {
        name: "0.20 mm",
        value: "0.20",
      },
      depth: {
        name: "0.20 mm",
        value: "0.20",
      },
      surface: {
        name: "Polished",
        value: "polished",
      },
    };
  });

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `activeTab_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `activeTab_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, activeTab);
  }, [activeTab, activeRing]);

  // Save selectedGrooveOptions to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `grooveOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `grooveOptions_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, JSON.stringify(selectedGrooveOptions));
  }, [selectedGrooveOptions, activeRing]);

  // Save selectedLeftStepOptions to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `leftStepOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `leftStepOptions_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, JSON.stringify(selectedLeftStepOptions));
  }, [selectedLeftStepOptions, activeRing]);

  // Save selectedRightStepOptions to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `rightStepOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `rightStepOptions_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, JSON.stringify(selectedRightStepOptions));
  }, [selectedRightStepOptions, activeRing]);

  console.log("selectedGrooveOptions", selectedGrooveOptions);
  console.log("selectedLeftStepOptions", selectedLeftStepOptions);
  console.log("selectedRightStepOptions", selectedRightStepOptions);

  return (
    <div className="mb-auto">
      {rings &&
        (rings[0]?.type === rings[1]?.type ||
          rings[2]?.type === rings[3]?.type) && (
          <IsPair
            activeRing={activeRing}
            isPair={isPair}
            setIsPair={setIsPair}
          />
        )}

      {/* Tab buttons */}
      <div className="bg-[#e1e1e1] flex">
        <button
          onClick={() => setActiveTab("grooves")}
          className={`py-3 px-5 font-semibold ${
            activeTab === "grooves" ? "bg-[#f9f9fa] text-black text-lg" : ""
          }`}
        >
          Grooves
        </button>
        <button
          onClick={() => setActiveTab("steps")}
          className={`py-3 px-5 font-semibold ${
            activeTab === "steps" ? "bg-[#f9f9fa] text-black text-lg" : ""
          }`}
        >
          Steps
        </button>
      </div>

      {activeTab === "grooves" && (
        <StepGroove
          activeRing={activeRing}
          selectedGrooveOptions={selectedGrooveOptions}
          setSelectedGrooveOptions={setSelectedGrooveOptions}
        />
      )}

      {activeTab === "steps" && (
        <StepTab
          activeRing={activeRing}
          selectedLeftStepOptions={selectedLeftStepOptions}
          selectedRightStepOptions={selectedRightStepOptions}
          setSelectedLeftStepOptions={setSelectedLeftStepOptions}
          setSelectedRightStepOptions={setSelectedRightStepOptions}
        />
      )}
    </div>
  );
};