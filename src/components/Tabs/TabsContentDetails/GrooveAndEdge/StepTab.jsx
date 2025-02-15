import { useState } from "react";
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
  selectedLeftStepOptions,
  setSelectedLeftStepOptions,
  selectedRightStepOptions,
  setSelectedRightStepOptions,
}) => {
  const [optionStepLeft, setOptionStepLeft] = useState("Without");
  const [optionStepRight, setOptionStepRight] = useState("Without");

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