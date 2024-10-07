import { useState } from "react";
import StepTab from "./StepTab";
import StepGroove from "./StepGroove";

export const GrooveAndEdge = ({ isPair, toggleIsPair, activeRing }) => {
  const [activeTab, setActiveTab] = useState("grooves");

  const [selectedGrooveOptions, setSelectedGrooveOptions] = useState({
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
  });

  const [selectedLeftStepOptions, setSelectedLeftStepOptions] = useState({
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
  });

  const [selectedRightStepOptions, setSelectedRightStepOptions] = useState({
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
  });

  console.log("selectedGrooveOptions", selectedGrooveOptions);
  console.log("selectedLeftStepOptions", selectedLeftStepOptions);
  console.log("selectedRightStepOptions", selectedRightStepOptions);

  return (
    <div className="mb-auto">
      <div className="py-3 flex items-center bg-white">
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
          className="mr-2"
        />
        <label className="text-sm font-semibold">
          Use the same settings for both rings
        </label>
      </div>

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
