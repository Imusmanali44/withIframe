import { useState, useEffect } from "react";

export const GrooveRangeSlider = ({
  title = "Ring",
  grooves = [],
  min = -1,
  max = 1,
  step = 0.001,
  defaultValue = 0,
  totalWidth = 4.0,
  dividerIcon = "./src/assets/drop.png",
}) => {
  // Use localStorage for values
  const [values, setValues] = useState(() => {
    // Try to get from localStorage or initialize as empty object
    const storageKey = `grooveSliders_${title}`;
    const savedValues = localStorage.getItem(storageKey);
    return savedValues ? JSON.parse(savedValues) : {};
  });
  
  const [activeHandle, setActiveHandle] = useState(null);

  // Calculate initial position for a new groove
  const calculateInitialPosition = (grooveId, totalGrooves) => {
    // For Ring 1, example values: 0.95, 2.00, 3.05, 3.58
    // For Ring 2, example values: 0.36, 0.83, 1.29, 1.75
    const spacing = (max - min) / (totalGrooves + 1);
    const position = min + (spacing * grooveId);
    return position;
  };

  // Initialize or update values when grooves change
  useEffect(() => {
    const newValues = { ...values };
    let valueChanged = false;
    
    grooves.forEach((groove, index) => {
      if (!(groove.id in newValues)) {
        const initialPosition = calculateInitialPosition(groove.id, grooves.length);
        newValues[groove.id] = initialPosition;
        valueChanged = true;
        console.log(`Groove ${groove.id} initial position:`, initialPosition);
        window.parent.postMessage(
          {
            action: "changeGrooveSlider",
            value: initialPosition,
            selectedRing: title,
            grooveId: groove.id,
            type: "initial"
          },
          "*"
        );
      }
    });
    
    if (valueChanged) {
      setValues(newValues);
    }
  }, [grooves.length]);

  // Save values to localStorage when they change
  useEffect(() => {
    const storageKey = `grooveSliders_${title}`;
    localStorage.setItem(storageKey, JSON.stringify(values));
  }, [values, title]);

  const mapToUIValue = (internalValue) => {
    const minUI = 0.8;
    const maxUI = 3.7;
    return ((internalValue - min) / (max - min)) * (maxUI - minUI) + minUI;
  };

  const handleChange = (event, grooveId) => {
    const newValue = parseFloat(event.target.value);
    const uiValue = mapToUIValue(newValue);

    if (uiValue < 0.9 || uiValue > 3.6) {
      return;
    }

    setValues(prev => ({
      ...prev,
      [grooveId]: newValue
    }));

    console.log(`Groove ${grooveId} position changed to:`, newValue);
    window.parent.postMessage(
      {
        action: "changeGrooveSlider",
        value: newValue,
        selectedRing: title,
        grooveId: grooveId
      },
      "*"
    );
  };

  return (
    <div className="flex flex-col items-start w-full mt-4">
      <label className="font-medium text-start py-1 text-black">
        {title} - Position
      </label>
      
      <div className="relative w-full h-9 bg-amber-50 rounded-md">
        <div className="absolute w-full text-center top-2">
          <span className="font-medium">{totalWidth.toFixed(2)} mm</span>
        </div>

        <div className="absolute w-full h-full">
          {grooves.map((groove) => (
            <div 
              key={groove.id}
              className="absolute w-full h-full"
            >
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={values[groove.id] || defaultValue}
                onChange={(e) => handleChange(e, groove.id)}
                className="absolute bottom-0 w-full opacity-0 cursor-pointer"
                style={{ height: "100%" }}
              />
            </div>
          ))}
        </div>

        <div className="absolute w-full h-full pointer-events-none">
          {grooves.map((groove) => {
            const leftPosition = ((values[groove.id] || defaultValue) - min) / (max - min) * 100;
            
            return (
              <div
                key={groove.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${leftPosition}%`,
                  top: "90%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="relative">
                  <img
                    src={dividerIcon}
                    alt="Drop Icon"
                    className="w-4 h-4 mt-1"
                    draggable="false"
                  />
                  <span 
                    className="absolute -top-1 -right-2 text-xs font-bold bg-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {groove.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GrooveRangeSlider;