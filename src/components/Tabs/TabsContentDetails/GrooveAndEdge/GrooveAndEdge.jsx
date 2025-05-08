import { useState, useEffect } from "react";
import StepTab from "./StepTab";
import StepGroove from "./StepGroove";
import IsPair from "../../../shared/IsPair";

export const GrooveAndEdge = ({rings, isPair, setIsPair, activeRing }) => {
  // Create storage key based on the active ring
  const getStorageKey = (suffix) => {
    return Array.isArray(activeRing) 
      ? `${suffix}_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `${suffix}_${activeRing?.name}`;
  };

  // Use localStorage for activeTab
  const [activeTab, setActiveTab] = useState(() => {
    const storageKey = getStorageKey('activeTab');
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
    const storageKey = getStorageKey('grooveOptions');
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
    const storageKey = getStorageKey('leftStepOptions');
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
    const storageKey = getStorageKey('rightStepOptions');
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

  // Effect to reload states when activeRing changes
  useEffect(() => {
    // Load activeTab
    const tabKey = getStorageKey('activeTab');
    const savedTab = localStorage.getItem(tabKey);
    if (savedTab) setActiveTab(savedTab);
    
    // Load groove options
    const grooveKey = getStorageKey('grooveOptions');
    const savedGroove = localStorage.getItem(grooveKey);
    if (savedGroove) setSelectedGrooveOptions(JSON.parse(savedGroove));
    
    // Load left step options
    const leftStepKey = getStorageKey('leftStepOptions');
    const savedLeftStep = localStorage.getItem(leftStepKey);
    if (savedLeftStep) setSelectedLeftStepOptions(JSON.parse(savedLeftStep));
    
    // Load right step options
    const rightStepKey = getStorageKey('rightStepOptions');
    const savedRightStep = localStorage.getItem(rightStepKey);
    if (savedRightStep) setSelectedRightStepOptions(JSON.parse(savedRightStep));
  }, [activeRing]);

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('activeTab');
    localStorage.setItem(storageKey, activeTab);
  }, [activeTab, activeRing]);

  // Save selectedGrooveOptions to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('grooveOptions');
    localStorage.setItem(storageKey, JSON.stringify(selectedGrooveOptions));
  }, [selectedGrooveOptions, activeRing]);

  // Save selectedLeftStepOptions to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('leftStepOptions');
    localStorage.setItem(storageKey, JSON.stringify(selectedLeftStepOptions));
  }, [selectedLeftStepOptions, activeRing]);

  // Save selectedRightStepOptions to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('rightStepOptions');
    localStorage.setItem(storageKey, JSON.stringify(selectedRightStepOptions));
  }, [selectedRightStepOptions, activeRing]);

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