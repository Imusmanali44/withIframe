import { useState, useEffect } from "react";

export const GrooveRangeSlider = ({
  title = "Ring",
  min = -1,
  max = 1,
  step = 0.001,
  defaultValue = 0,
  totalWidth = 4.0,
  thumbImage = "./src/assets/arrows.png", // Replace with your image URL
  dividerIcon = "./src/assets/drop.png", // Drop icon
}) => {
  const [value, setValue] = useState(defaultValue);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentMin, setCurrentMin] = useState(min);
  const [currentMax, setCurrentMax] = useState(max);
  const [currentStep, setCurrentStep] = useState(step);

  const mapToUIValue = (internalValue) => {
    const minUI = 0.8;
    const maxUI = 3.7;
    return (
      ((internalValue - currentMin) / (currentMax - currentMin)) *
        (maxUI - minUI) +
      minUI
    );
  };

  const handleChange = (event) => {
    const newValue = parseFloat(event.target.value);
    const uiValue = mapToUIValue(newValue);

    if (uiValue < 0.9 || uiValue > 3.6) {
      return;
    }

    setValue(newValue);
    window.parent.postMessage(
      { action: "changeGrooveSlider", value: newValue, selectedRing: title },
      "*"
    );
  };

  const leftPercentage = ((value - currentMin) / (currentMax - currentMin)) * 100;

  return (
    <div className="flex flex-col items-start w-full mt-4">
      <label className="font-medium text-start py-1 text-black">
        {currentTitle}- Position
      </label>
      <div className="relative w-full h-9 bg-amber-50 rounded-md">
        {/* Center width display */}
        <div className="absolute w-full text-center top-2">
          <span className="font-medium">{totalWidth.toFixed(2)} mm</span>
        </div>

        {/* Position indicator */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${leftPercentage}%`,
            top: "90%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-0.5 h-6 bg-black"></div>
          <img
            src={dividerIcon}
            alt="Drop Icon"
            className="w-4 h-4 mt-1"
          />
        </div>

        {/* Range input */}
        <input
          type="range"
          min={currentMin}
          max={currentMax}
          step={currentStep}
          value={value}
          onChange={handleChange}
          className="absolute bottom-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
};

export default GrooveRangeSlider;
