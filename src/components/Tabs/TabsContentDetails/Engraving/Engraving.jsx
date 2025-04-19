import { useState, useEffect } from "react";
import IsPair from "../../../shared/IsPair";
import TabContent from "./TabContent";

const engravingOptions = [
  {
    value: "handwritten",
    label: "Handwriting",
    description:
      "Your handwriting can be engraved by laser on both the inside and outside of your rings. You will receive detailed information on the procedure once you place your order.",
  },
  {
    value: "fingerprint",
    label: "Fingerprint",
    description:
      "Your fingerprint can be engraved by laser on both the inside and outside of your rings. You will receive detailed information on the procedure once you place your order.",
  },
  {
    value: "graphic",
    label: "Graphics",
    description:
      "Your graphics can be engraved by laser on both the inside and outside of your rings. You will receive detailed information on the procedure once you place your order.",
  },
];

const fontLaser = [
  { value: "svnfont00", label: "Abc 123", style: "italic" },
  { value: "svnfont01", label: "Abc 123", style: "italic" },
  { value: "svnfont02", label: "Abc 123", style: "italic" },
  { value: "svnfont03", label: "Abc 123", style: "italic" },
  { value: "svnfont04", label: "Abc 123", style: "italic" },
];

const fontDiamond = [
  { value: "svnfont00", label: "Abc 123", style: "italic" },
  { value: "svnfont01", label: "Abc 123", style: "italic" },
];

// Toggle Component
export const Toggle = ({ label, checked, onChange }) => (
  <label>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mr-2.5"
    />
    <span className="text-sm font-semibold">{label}</span>
  </label>
);

const EngravingOptions = ({ rings, isPair, setIsPair, activeRing }) => {
  // Initialize activeTab from localStorage or default to "laser"
  const [activeTab, setActiveTab] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `engravingTab_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `engravingTab_${activeRing?.name}`;
    
    return localStorage.getItem(storageKey) || "laser";
  });

  // Initialize separate engravingText values for Ring 1, Ring 2, and Ring 3
  const [engravingText, setEngravingText] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `engravingText_Ring1_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `engravingText_Ring1_${activeRing?.name}`;
    
    return localStorage.getItem(storageKey) || "";
  });

  // Initialize selectedOptions from localStorage or default values
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `engravingOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `engravingOptions_${activeRing?.name}`;
    
    const savedOptions = localStorage.getItem(storageKey);
    return savedOptions ? JSON.parse(savedOptions) : {
      handwritten: false,
      fingerprint: false,
      graphic: false,
    };
  });

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `engravingTab_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `engravingTab_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, activeTab);
  }, [activeTab, activeRing]);

  // Save engravingText to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `engravingText_Ring1_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `engravingText_Ring1_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, engravingText);
  }, [engravingText, activeRing]);

  // Save selectedOptions to localStorage when they change
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `engravingOptions_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `engravingOptions_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, JSON.stringify(selectedOptions));
  }, [selectedOptions, activeRing]);

  const handleToggleChange = (optionValue, checked) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionValue]: checked,
    }));
  };

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
          onClick={() => setActiveTab("laser")}
          className={`py-3 px-5 font-semibold ${
            activeTab === "laser" ? "bg-[#f9f9fa] text-black text-lg" : ""
          }`}
        >
          Laser engraving
        </button>
        <button
          onClick={() => setActiveTab("diamond")}
          className={`py-3 px-5 font-semibold ${
            activeTab === "diamond" ? "bg-[#f9f9fa] text-black text-lg" : ""
          }`}
        >
          Diamond engraving
        </button>
      </div>

      {activeTab === "laser" && (
        <TabContent
          isPair={isPair}
          engravingText={engravingText}
          setEngravingText={setEngravingText}
          fonts={fontLaser}
          activeRing={activeRing}
          engravingType="laser"
        />
      )}
      {activeTab === "diamond" && (
        <TabContent
          isPair={isPair}
          engravingText={engravingText}
          setEngravingText={setEngravingText}
          fonts={fontDiamond}
          activeRing={activeRing}
          engravingType="diamond"
        />
      )}

      <div className="flex flex-col w-full max-w-[500px] mx-auto">
        <div className="toggle-group engraving-options-selector">
          {engravingOptions.map((option) => (
            <div
              key={option.value}
              className={`option option-${option.value} bg-white p-3 mb-3`}
            >
              <Toggle
                label={option.label}
                checked={selectedOptions[option.value]}
                onChange={(checked) =>
                  handleToggleChange(option.value, checked)
                }
              />
              {selectedOptions[option.value] && (
                <p className={`mt-2 text-sm text-gray-600`}>
                  {option.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngravingOptions;