import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("laser");
  const [engravingText, setEngravingText] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    handwritten: false,
    fingerprint: false,
    graphic: false,
  });

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
        />
      )}
      {activeTab === "diamond" && (
        <TabContent
          isPair={isPair}
          engravingText={engravingText}
          setEngravingText={setEngravingText}
          fonts={fontDiamond}
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
