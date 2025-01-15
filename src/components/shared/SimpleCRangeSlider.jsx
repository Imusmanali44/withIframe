window.newValue = 0;
import React, { useState, useEffect, useCallback } from "react";

const MultiRangeMaskSlider = ({ step = 0.0001 }) => {
  const MIN_UI_DISTANCE = 0.80; // Minimum 0.80mm distance in UI values

  const initializeValues = () => {
    if (window.selectedRing === 1 && window.ringsLength === 1) {
      return {
        title: "Ring 1",
        leftMin: -0.15,
        leftMax: -0.03,
        rightMin: 0.03,
        rightMax: 0.15,
        leftValue: -0.065,
        rightValue: 0.065,
      };
    }
    if (window.selectedRing === 2 && window.ringsLength === 2) {
      return {
        title: "Ring 2",
        leftMin: -0.69,
        leftMax: -0.55,
        rightMin: 0.71,
        rightMax: 0.85,
        leftValue: -0.67,
        rightValue: 0.71,

        // leftMin: -0.75,
        // leftMax: -0.55,
        // rightMin: 0.73,
        // rightMax: 0.84,
        // leftValue: -0.642,
        // rightValue: 0.780,
      };}
    if (window.selectedRing === 1 && window.ringsLength === 2) {
      return {
        title: "Ring 1",
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
      leftMin: -0.85,
      leftMax: -0.55,
      rightMin: 0.55,
      rightMax: 0.85,
      leftValue: -0.7,
      rightValue: 0.7,
    };
  };

  const initialValues = initializeValues();
  const [title, setTitle] = useState(initialValues.title);
  const [leftValue, setLeftValue] = useState(null);
  const [rightValue, setRightValue] = useState(null);
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
  const [isDragging, setIsDragging] = useState({ left: false, right: false });

const mapToUIValue = (value) => {
  const minUI = 0.8;
  const maxUI = 3.7;
  const totalRange = 1.7; // Total range from -0.85 to 0.85
  return ((value) ) * (maxUI - minUI) + minUI;
};

  const mapFromUIValue = (uiValue) => {
    uiValue = uiValue 
    const minUI = 0.8;
    const maxUI = 3.70;
    const totalRange = 1.7;
    return ((uiValue - minUI) / (maxUI - minUI)) * totalRange - 0.85;
  };

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

  const handleMouseDown = useCallback(
    (side) => (e) => {
      e.preventDefault();
      setIsDragging({ left: side === "left", right: side === "right" });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.left && !isDragging.right) return;
  
      const container = e.currentTarget.getBoundingClientRect();
      const position = (e.clientX - container.left) / container.width;
      const uiValue = position * (3.70 - 0.8) + 0.8;
      const newRawValue = mapFromUIValue(uiValue);
  
      if (isDragging.left) {
        console.log("i is left")
        const maxAllowedValue = Math.min(
          ranges.left.max,
          rightValue - step // Enforce minimum distance
        );
        let newValue = null
       
         newValue = Math.max(ranges.left.min, Math.min(newRawValue, maxAllowedValue));
        setLeftValue(newValue);
        if (window.selectedRing === 2 ){
           newValue = -0.55 -(newValue - (-0.69) )
           window.newValue = newValue }
        sendMessageToParent(newValue, rightValue);
        // setLeftValue(newValue);
      } else {
        console.log("i is right")

        const minAllowedValue = Math.max(
          ranges.right.min,
          leftValue + step // Enforce minimum distance
        );
        const newValue = Math.min(ranges.right.max, Math.max(newRawValue, minAllowedValue));
        setRightValue(newValue);
        if(window.ringsLength==1){
          sendMessageToParent(leftValue, newValue);

        }
        else{
          sendMessageToParent(window.newValue, newValue);

        }
      }
    },
    [isDragging, ranges, leftValue, rightValue, step]
  );
  const handleMouseUp = useCallback(() => {
    setIsDragging({ left: false, right: false });
  }, []);

  useEffect(() => {
    if (isDragging.left || isDragging.right) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate UI values and percentages
  const leftUIValue = mapToUIValue(leftValue);
  const rightUIValue = mapToUIValue(rightValue);
  const middleValue = Math.abs(rightUIValue - leftUIValue);

  const totalRange = 1.7;
  const leftPercentage = ((leftValue + 0.85) / totalRange) * 100;
  const rightPercentage = ((rightValue + 0.85) / totalRange) * 100;

  return (
    <div className="flex flex-col items-center justify-start mt-4 w-full max-w-xl">
      <label className="font-medium text-start py-1">{title} - Position</label>
      <div
  className="relative w-full px-2.5 py-7 flex items-center justify-center h-40"
  onMouseMove={handleMouseMove}
>
  {/* Base track */}
  <div className="absolute h-2 w-full bg-gray-200 rounded"></div>

  {/* Gold sections */}
  <div
    className="absolute h-2"
    style={{
      left: 0,
      height: 40,
      width: `${leftPercentage}%`,
      backgroundColor: "#D8BC7E",
      borderRadius: "5px 0 0 5px",
    }}
  />
  <div
    className="absolute h-2"
    style={{
      left: `${rightPercentage}%`,
      right: 0,
      height: 40,
      backgroundColor: "#D8BC7E",
      borderRadius: "0 5px 5px 0",
    }}
  />

  {/* Silver/Gray section */}
  <div
    className="absolute h-2"
    style={{
      height: 40,
      left: `${leftPercentage}%`,
      width: `${rightPercentage - leftPercentage}%`,
      backgroundColor: "#A09F9D",
    }}
  />

  {/* Left Value */}
  <div
    className="absolute text-sm font-bold text-gray-700"
    style={{
      left: "10px",
      // bottom: "-2px", // Position below the slider
      transform: "translateX(0)",
      textAlign: "center",
      width: "fit-content",
    }}
  >
    {Math.abs(leftUIValue.toFixed(2))} mm
  </div>

  {/* Middle Value */}
  <div
    className="absolute text-sm font-bold text-gray-700"
    style={{
      marginTop:"70px",
      left: `${(leftPercentage + rightPercentage) / 2}%`, // Dynamic centering
      // bottom: "-1px", // Position below the slider
      transform: "translateX(-50%)",
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    {middleValue.toFixed(2)} mm
  </div>

  {/* Right Value */}
  <div
    className="absolute text-sm font-bold text-gray-700"
    style={{
      right: "10px",
      // bottom: "-2px", // Position below the slider
      transform: "translateX(0)",
      textAlign: "center",
      width: "fit-content",
    }}
  >
    {rightUIValue.toFixed(2)} mm
  </div>

  {/* Divider Icons */}
  <img
    src="./src/assets/drop.png"
    alt="left divider icon"
    style={{
      position: "absolute",
      left: `${leftPercentage}%`,
      transform: "translateX(-50%)",
      top: "55%",
      zIndex: 3,
      width: "20px",
      height: "20px",
      marginLeft: "1px",
    }}
  />
  <img
    src="./src/assets/drop.png"
    alt="right divider icon"
    style={{
      position: "absolute",
      left: `${rightPercentage}%`,
      transform: "translateX(-50%)",
      top: "55%",
      zIndex: 3,
      width: "20px",
      height: "20px",
      marginLeft: "1px",
    }}
  />

  {/* Draggable divider lines */}
  <div
    className="absolute h-4 w-0.5 bg-black z-10 -mt-1 cursor-ew-resize"
    style={{
      left: `${leftPercentage}%`,
      height: "40px",
    }}
    onMouseDown={handleMouseDown("left")}
  ></div>
  <div
    className="absolute h-4 w-0.5 bg-black z-10 -mt-1 cursor-ew-resize"
    style={{
      left: `${rightPercentage}%`,
      height: "40px",
    }}
    onMouseDown={handleMouseDown("right")}
  ></div>
</div>

    </div>
  );
};

export default MultiRangeMaskSlider;
