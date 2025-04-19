import { useState, useEffect } from "react";
import WidthDepthSurface from "./WidthDepthSurface";

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
  // Initialize optionStepLeft from localStorage or default to "Without"
  const [optionStepLeft, setOptionStepLeft] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `optionStepLeft_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `optionStepLeft_${activeRing?.name}`;
    
    return localStorage.getItem(storageKey) || "Without";
  });

  // Initialize optionStepRight from localStorage or default to "Without"
  const [optionStepRight, setOptionStepRight] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `optionStepRight_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `optionStepRight_${activeRing?.name}`;
    
    return localStorage.getItem(storageKey) || "Without";
  });

  // Save optionStepLeft to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `optionStepLeft_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `optionStepLeft_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, optionStepLeft);
  }, [optionStepLeft, activeRing]);

  // Save optionStepRight to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `optionStepRight_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `optionStepRight_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, optionStepRight);
  }, [optionStepRight, activeRing]);

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      <label htmlFor="steps" className="block mb-2">
        Left
      </label>
      <div className="flex items-start space-x-2">
        {stepLeftOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setOptionStepLeft(item.name);
              console.log('Left step changed to:', item.name);
              window.parent.postMessage(
                {
                  action: "addStep",
                  value: "left",
                  type: item.name,
                  // isBiCol: selectedPartitionTwotoneImg,
                  // isTriCol: selectedPartitionTriColoredImg,
                  // field: partition,
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
            <span className="text-sm">{item.name}</span>
            <img src={item.img} className="mx-auto mt-5" alt={item.name} />
          </button>
        ))}
      </div>
      {optionStepLeft !== "Without" && (
        <WidthDepthSurface
          groove={optionStepLeft}
          selectedOptions={selectedLeftStepOptions}
          setSelectedOptions={setSelectedLeftStepOptions}
        />
      )}

      <div className="border my-10"></div>

      <label htmlFor="steps" className="block mb-2">
        Right
      </label>
      <div className="flex items-start space-x-2">
        {stepRightOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setOptionStepRight(item.name);
              console.log('Right step changed to:', item.name);
              window.parent.postMessage(
                {
                  action: "addStep",
                  value: "right",
                  type: item.name,

                  // isBiCol: selectedPartitionTwotoneImg,
                  // isTriCol: selectedPartitionTriColoredImg,
                  // field: partition,
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
            <span className="text-sm">{item.name}</span>
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
        />
      )}
    </div>
  );
};

export default StepTab;