import React, { useState, useEffect, useCallback } from "react";

// window.newValue = 0;
// window.newValue2 = 0.65

const MultiRangeMaskSlider2 = ({ step = 0.0001 }) => {

  
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
        uiMin: 0.8,
        uiMax: 3.7
      };
    }
    if (window.ringsLength === 2) {
      return {
        title: "Ring 2",
        leftMin: -0.69,
        leftMax: -0.59,
        rightMin: 0.72,
        rightMax: 0.85,
        leftValue: -0.67,
        rightValue: 0.71,
        uiMin: 1.67,
        uiMax: 2.86
      };
    }
    if (window.selectedRing === 1 && window.ringsLength === 2) {
        return {
            title: "Ring 2",
            leftMin: -0.69,
            leftMax: -0.55,
            rightMin: 0.74,
            rightMax: 0.85,
            leftValue: -0.67,
            rightValue: 0.71,
            uiMin: 1.67,
            uiMax: 2.86
          };
    }
    
    return {
        title: "Ring 2",
        leftMin: -0.69,
        leftMax: -0.55,
        rightMin: 0.74,
        rightMax: 0.85,
        leftValue: -0.67,
        rightValue: 0.71,
        uiMin: 1.67,
        uiMax: 2.86
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
    ui: {
      min: initialValues.uiMin,
      max: initialValues.uiMax
    }
  });
  const [isDragging, setIsDragging] = useState({ left: false, right: false });

  // Map internal values to UI display values
  const mapToUIValue = useCallback((value) => {
    const { min: minUI, max: maxUI } = ranges.ui;
    const totalRange = 1.7; // Total range from -0.85 to 0.85
    return ((value + 0.85) / totalRange) * (maxUI - minUI) + minUI;
  }, [ranges.ui]);

  // Map UI display values back to internal values
  const mapFromUIValue = useCallback((uiValue) => {
    const { min: minUI, max: maxUI } = ranges.ui;
    const totalRange = 1.7;
    return ((uiValue - minUI) / (maxUI - minUI)) * totalRange - 0.85;
  }, [ranges.ui]);

  // Handle iframe messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === "updateRingConfig") {
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
          ui: {
            min: values.uiMin,
            max: values.uiMax
          }
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
      ui: {
        min: values.uiMin,
        max: values.uiMax
      }
    });
  }, [window.selectedRing, window.ringsLength]);

  const sendMessageToParent = (left, right,ringnum) => {
    window.parent.postMessage(
      {
        action: "changeMultiSlider",
        value: { left, right },
        selectedRing: ringnum
      },
      "*"
    );
  };

const handleMouseDown = useCallback(
  (side) => (e) => {
    e.preventDefault();
    setIsDragging({ left: side === "left", right: side === "right" });
    document.body.style.cursor = "ew-resize"; // Change cursor for better UX
  },
  []
);

  const handleTouchStart = useCallback(
    (side) => (e) => {
      e.preventDefault();
      setIsDragging({ left: side === "left", right: side === "right" });
      document.body.style.cursor = "ew-resize"; // Change cursor for better UX
    },
    []
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.left && !isDragging.right) return;

      const container = e.currentTarget.getBoundingClientRect();
      const position = (e.clientX - container.left) / container.width;
      const uiValue = position * (ranges.ui.max - ranges.ui.min) + ranges.ui.min;
      const newRawValue = mapFromUIValue(uiValue);

      if (isDragging.left) {
        const maxAllowedValue = Math.min(
          ranges.left.max,
          rightValue - step
        );
        let newValue = Math.max(ranges.left.min, Math.min(newRawValue, maxAllowedValue));
        setLeftValue(newValue);

        if (window.selectedRing === 2) {
          newValue = -0.55 - (newValue - (-0.69));
          window.newValue = newValue;
          sendMessageToParent(newValue, rightValue,title);
        } else if (window.selectedRing === 1 && window.ringsLength === 2) {
            newValue = -0.55 - (newValue - (-0.69));
            window.newValue = newValue;
            sendMessageToParent(newValue, rightValue,title);
        } else if (window.ringsLength === 1) {
        //   sendMessageToParent(newValue, rightValue);
        }
      } else {
        const minAllowedValue = Math.max(
          ranges.right.min,
          leftValue + step
        );
        let newValue = Math.min(ranges.right.max, Math.max(newRawValue, minAllowedValue));
        setRightValue(newValue);

        if (window.ringsLength === 1) {
        //   sendMessageToParent(leftValue, newValue);
        } else if (window.selectedRing === 1 && window.ringsLength === 2) {
        //   newValue = 0.58 - (newValue - 0.68);
        //   window.newValue2 = newValue;
        //   sendMessageToParent(leftValue, newValue);
        sendMessageToParent(window.newValue, newValue,title);
        } else if (window.selectedRing === 2 && window.ringsLength === 2) {
          sendMessageToParent(window.newValue, newValue,title);
        }
      }
    },
    [isDragging, ranges, leftValue, rightValue, step, mapFromUIValue]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging.left && !isDragging.right) return;
      
      const touch = e.touches[0];
      const container = e.currentTarget.getBoundingClientRect();
      const position = (touch.clientX - container.left) / container.width;
      const uiValue = position * (ranges.ui.max - ranges.ui.min) + ranges.ui.min;
      const newRawValue = mapFromUIValue(uiValue);

      // Reuse the same logic as handleMouseMove
      if (isDragging.left) {
        // ... (same as in handleMouseMove)
      } else {
        // ... (same as in handleMouseMove)
      }
    },
    [isDragging, ranges, leftValue, rightValue, step, mapFromUIValue]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging({ left: false, right: false });
    document.body.style.cursor = ""; // Reset cursor
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging({ left: false, right: false });
  }, []);

  useEffect(() => {
    if (isDragging.left || isDragging.right) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Calculate UI values and percentages
  const leftUIValue = mapToUIValue(leftValue);
  const rightUIValue = mapToUIValue(rightValue);
  const middleValue = Math.abs(rightUIValue - leftUIValue);

  const totalRange = 1.7;
  const leftPercentage = ((leftValue + 1.2) / totalRange) * 100;
  const rightPercentage = ((rightValue + 0.6) / totalRange) * 100;

  return (
    <div className="flex flex-col items-center justify-start mt-4 w-full max-w-xl">
      <label className="font-medium text-start py-1">{title} - Position</label>
      <div
        className="relative w-full px-2.5 py-7 flex items-center justify-center h-40"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
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
            marginTop: "70px",
            left: `${(leftPercentage + rightPercentage) / 2}%`,
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
          onMouseDown={handleMouseDown("left")}
          onTouchStart={handleTouchStart("left")}
      
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
          onMouseDown={handleMouseDown("right")}
          onTouchStart={handleTouchStart("right")}
        />

        {/* Draggable divider lines */}
        <div
          className="absolute h-4 w-0.5 bg-black z-10 -mt-1 cursor-ew-resize"
          style={{
            left: `${leftPercentage}%`,
            height: "40px",
          }}
          onMouseDown={handleMouseDown("left")}
          onTouchStart={handleTouchStart("left")}
        ></div>
        <div
          className="absolute h-4 w-0.5 bg-black z-10 -mt-1 cursor-ew-resize"
          style={{
            left: `${rightPercentage}%`,
            height: "40px",
          }}
          onMouseDown={handleMouseDown("right")}
          onTouchStart={handleTouchStart("right")}
        ></div>
      </div>
    </div>
  );
};

export default MultiRangeMaskSlider2;