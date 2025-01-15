import { useState, useEffect } from "react";

export const RangeSlider = ({
  title = "Ring",
  min = -1,
  max = 1,
  step = 0.001,
  defaultValue = 0,
  thumbImage = "./src/assets/arrows.png", // Replace with your image URL
  dividerIcon = "./src/assets/drop.png", // Replace with your icon URL
}) => {
  const [value, setValue] = useState(defaultValue);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentMin, setCurrentMin] = useState(min);
  const [currentMax, setCurrentMax] = useState(max);
  const [currentStep, setCurrentStep] = useState(step);
  const [currentDefaultValue, setCurrentDefaultValue] = useState(defaultValue);

  // Update settings based on the selected ring
  useEffect(() => {
    if (window.selectedRing === 1 && window.ringsLength === 2) {
      // setCurrentTitle("Ring 1 (4.50 mm)");
      // setCurrentMin(-0.85);
      // setCurrentMax(-0.55);
      // setCurrentStep(0.001);
      // setCurrentDefaultValue(-0.7);
      // setValue(-0.7);
    } else if (window.selectedRing === 2 && window.ringsLength === 2) {
      // setCurrentTitle("Ring 2 (4.50 mm)");
      // setCurrentMin(0.55);
      // setCurrentMax(0.85);
      // setCurrentStep(0.001);
      // setCurrentDefaultValue(0.7);
      // setValue(0.7);
    }
       if (window.ringsLength === 1) {
      // setCurrentTitle("Ring 1 (4.50 mm)");
      // setCurrentMin(-1);
      // setCurrentMax(1);
      // setCurrentStep(0.001);
      // setCurrentDefaultValue(0);
      // setValue(0);
    }
  }, [window.selectedRing, window.ringsLength]);

  const mapToUIValue = (internalValue) => {
    const minUI = 0.8;
    const maxUI = 3.70;
    return (
      ((internalValue - currentMin) / (currentMax - currentMin)) *
        (maxUI - minUI) +
      minUI
    );
  };

  const handleChange = (event) => {
    const newValue = parseFloat(event.target.value);

    const uiValue = mapToUIValue(newValue);
    if (uiValue < 1.20 || uiValue > 3.20) {
      return; // Prevent further movement
    }
//     if(title=="Ring 1"){
//       setCurrentTitle("Ring 1");
//       setCurrentMin(-0.85);
//       setCurrentMax(-0.55);
//       setCurrentStep(0.001);
//       setCurrentDefaultValue(-0.7);
//       // setValue(-0.7);

//     }
//     else if(title=="Ring 2"){
//  setCurrentTitle("Ring 2");
//       setCurrentMin(0.55);
//       setCurrentMax(0.85);
//       setCurrentStep(0.001);
//       setCurrentDefaultValue(0.7);
//       // setValue(0.7);

//     }
    setValue(newValue);
    window.parent.postMessage(
      { action: "changeSlider", value: newValue, selectedRing: title },
      "*"
    );
  };

  const uiLeftValue = mapToUIValue(value);
  const uiRightValue = 4.5 - uiLeftValue;

  const leftPercentage = ((value - currentMin) / (currentMax - currentMin)) * 100;

  return (
    <div className="flex flex-col items-center justify-start mt-4">
      <label
        htmlFor="dynamic-range-slider"
        className="font-medium text-start py-1"
      >
        {currentTitle} - Position
      </label>
      <div
        className="slider-container relative w-full px-2.5 py-7 flex items-center justify-center"
        style={{
          height: "40px",
          borderRadius: "5px",
        }}
      >
        <div
          className="left-mask"
          style={{
            width: `${leftPercentage}%`,
            backgroundColor: "#A09F9D",
            height: "50%",
            position: "absolute",
            left: 0,
            borderRadius: "5px 0 0 5px",
          }}
        ></div>
        <div
          className="right-mask"
          style={{
            width: `${100 - leftPercentage}%`,
            backgroundColor: "#D8BC7E",
            height: "50%",
            position: "absolute",
            right: 0,
            borderRadius: "0 5px 5px 0",
          }}
        ></div>
        {/* Add the thick line */}
        <div
          className="divider-line"
          style={{
            width: "2px", // Adjust thickness
            height: "60%",
            backgroundColor: "black", // Color of the divider
            position: "absolute",
            left: `${leftPercentage}%`,
            transform: "translateX(-50%)",
            zIndex: 2, // Ensure it stays above the masks
          }}
        ></div>
        {/* Add the icon below the line */}
        <img
          src={dividerIcon}
          alt="divider icon"
          style={{
            position: "absolute",
            left: `${leftPercentage}%`,
            transform: "translateX(-50%)",
            top: "80%", // Position below the slider
            zIndex: 3, // Ensure it stays on top
            width: "20px", // Adjust size
            height: "20px", // Adjust size
          }}
        />
        <div
          className="left-value absolute text-sm font-bold text-gray-700"
          style={{
            left: `${leftPercentage / 2}%`,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            maxWidth: "50%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${uiLeftValue.toFixed(2)} mm`}
        </div>
        <div
          className="right-value absolute text-sm font-bold text-gray-700"
          style={{
            right: `${(100 - leftPercentage) / 2}%`,
            transform: "translateX(50%)",
            whiteSpace: "nowrap",
            maxWidth: "50%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${uiRightValue.toFixed(2)} mm`}
        </div>
        <input
          id="dynamic-range-slider"
          type="range"
          min={currentMin}
          max={currentMax}
          step={currentStep}
          value={value}
          onChange={handleChange}
          className="slider-thumb absolute w-full h-full z-10"
          style={{
            background: "transparent",
            appearance: "none",
          }}
        />
      </div>
    </div>
  );
};