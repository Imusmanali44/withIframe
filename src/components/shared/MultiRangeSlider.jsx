import React, { useState, useEffect } from "react";

export const MultiRangeSlider = ({
  step = 0.001,
}) => {
  const initializeValues = () => {
    if (window.selectedRing === 1 && window.ringsLength === 1) {
      return {
        title: "Ring 1",
        leftMin: -0.15,
        leftMax: 0,
        rightMin: 0,
        rightMax: 0.15,
        leftValue: -0.065,
        rightValue: 0.065,
      };
    }
    if (window.selectedRing === 1 && window.ringsLength === 2) {
      return {
        title: "Ring 1",
        leftMin: 0.6,
        leftMax: 0.85,
        rightMin: -0.800,
        rightMax: -0.553,
        leftValue: 0.756,
        rightValue: -0.644,
      };
    }
    if (window.selectedRing === 2 && window.ringsLength === 2) {
      return {
        title: "Ring 2",
        leftMin: -0.75,
        leftMax: -0.55,
        rightMin: 0.73,
        rightMax: 0.84,
        leftValue: -0.642,
        rightValue: 0.780,
      };
    }
    return {
      title: "Default Ring",
      leftMin: -0.60,
      leftMax: -0.80,
      rightMin: 0.692,
      rightMax: 0.90,
      leftValue: -0.600,
      rightValue: 0.78,
    };
  };

  const initialValues = initializeValues();
  const [title, setTitle] = useState(initialValues.title);
  const [leftValue, setLeftValue] = useState(initialValues.leftValue);
  const [rightValue, setRightValue] = useState(initialValues.rightValue);
  const [ranges, setRanges] = useState({
    left: {
      min: initialValues.leftMin,
      max: initialValues.leftMax,
    },
    right: {
      min: initialValues.rightMin,
      max: initialValues.rightMax,
    },
  });

  useEffect(() => {
    const values = initializeValues();
    setTitle(values.title);
    setLeftValue(values.leftValue);
    setRightValue(values.rightValue);
    setRanges({
      left: {
        min: values.leftMin,
        max: values.leftMax,
      },
      right: {
        min: values.rightMin,
        max: values.rightMax,
      },
    });
  }, [window.selectedRing, window.ringsLength]);

  const sendMessageToParent = (left, right) => {
    window.parent.postMessage(
      {
        action: "changeMultiSlider",
        value: { left, right },
      },
      "*"
    );
  };

  const handleLeftChange = (event) => {
    const newValue = Math.max(
      ranges.left.min,
      Math.min(ranges.left.max, Number(event.target.value))
    );
    setLeftValue(newValue);
    sendMessageToParent(newValue, rightValue);
  };

  const handleRightChange = (event) => {
    const newValue = Math.max(
      ranges.right.min,
      Math.min(ranges.right.max, Number(event.target.value))
    );
    setRightValue(newValue);
    sendMessageToParent(leftValue, newValue);
  };

  return (
    <div className="multi-range-slider-container">
    <label className="multi-range-slider-label">
      {title}: [{leftValue.toFixed(3)}, {rightValue.toFixed(3)}]
    </label>
    <div className="multi-dual-sliders-container">
      {/* Left Slider */}
      <div className="multi-single-slider-container">
        <div className="multi-slider-label">
          Left Value ({ranges.left.min} to {ranges.left.max})
        </div>
        <div className="multi-slider-track"></div>
        <input
          type="range"
          min={ranges.left.min}
          max={ranges.left.max}
          step={step}
          value={leftValue}
          onChange={handleLeftChange}
          className="multi-slider-thumb"
        />
      </div>
  
      {/* Right Slider */}
      <div className="multi-single-slider-container">
        <div className="multi-slider-label">
          Right Value ({ranges.right.min} to {ranges.right.max})
        </div>
        <div className="multi-slider-track"></div>
        <input
          type="range"
          min={ranges.right.min}
          max={ranges.right.max}
          step={step}
          value={rightValue}
          onChange={handleRightChange}
          className="multi-slider-thumb"
        />
      </div>
    </div>
  </div>
  );
};

export default MultiRangeSlider;