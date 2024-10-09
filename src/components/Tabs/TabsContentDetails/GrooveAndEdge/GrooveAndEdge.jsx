import { useState } from "react";
import StepTab from "./StepTab";
import StepGroove from "./StepGroove";
import IsPair from "../../../shared/IsPair";

export const GrooveAndEdge = ({rings, isPair, setIsPair, activeRing }) => {
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
