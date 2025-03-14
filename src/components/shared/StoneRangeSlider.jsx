import { useState, useEffect } from "react";

export const StoneRangeSlider = ({
  title = "Stone Position",
  min = -0.11,
  max = 0.11,
  step = 0.001,
  defaultValue = 0,
  totalWidth = 4.0,
  handleIcon = "./src/assets/drop.png",
}) => {
  const [position, setPosition] = useState(defaultValue);

  // Initialize position on component mount
  useEffect(() => {
    // Send initial position message to parent
    // window.parent.postMessage(
    //   {
    //     action: "stonePosition",
    //     value: defaultValue,
    //     selectedRing: title,
    //     type: "initial"
    //   },
    //   "*"
    // );
  }, []);

  const handleChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setPosition(newValue);

    console.log(`Stone position changed to:`, newValue);
    window.parent.postMessage(
      {
        action: "stonePosition",
        value: newValue,
        selectedRing: title
      },
      "*"
    );
  };

  // Calculate position text to display (convert from -0.15~0.15 to Left/Middle/Right)
  const getPositionText = (value) => {
    if (value < -0.05) return "Left";
    if (value > 0.05) return "Right";
    return "Center";
  };

  return (
    <div className="flex flex-col items-start w-full mt-4">
      <div className="flex justify-between w-full">
        <label className="font-medium text-start py-1 text-black">
          {title}
        </label>
        <span className="font-medium py-1 text-black">
          {getPositionText(position)}
        </span>
      </div>
      
      <div className="relative w-full h-12 bg-amber-50 rounded-md">
        <div className="absolute w-full text-center top-2">
          <span className="font-medium">{totalWidth.toFixed(2)} mm</span>
        </div>

        {/* Left marker */}
        <div className="absolute left-2 bottom-0 text-xs text-gray-500">Left</div>
        
        {/* Right marker */}
        <div className="absolute right-2 bottom-0 text-xs text-gray-500">Right</div>
        
        {/* Center marker */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 text-xs text-gray-500">Center</div>

        <div className="absolute w-full h-full">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={position}
            onChange={handleChange}
            className="absolute bottom-0 w-full opacity-0 cursor-pointer"
            style={{ height: "100%" }}
          />
        </div>

        <div className="absolute w-full h-full pointer-events-none">
          {/* Stone handle */}
          <div
            className="absolute flex flex-col items-center"
            style={{
              left: `${((position - min) / (max - min)) * 100}%`,
              top: "90%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-0.5 h-6 bg-black"></div>
            <div className="relative">
              <img
                src={handleIcon}
                alt="Stone Icon"
                className="w-5 h-5 mt-1"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoneRangeSlider;