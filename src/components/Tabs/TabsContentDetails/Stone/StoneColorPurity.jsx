import { useEffect } from "react";

const StoneColorPurity = ({ selectedOption, handleChange, activeRing }) => {
  // Save selected option to localStorage when it changes
  useEffect(() => {
    if (selectedOption && activeRing) {
      const storageKey = Array.isArray(activeRing) 
        ? `stoneColorPurity_${activeRing[0]?.name}_${activeRing[1]?.name}` 
        : `stoneColorPurity_${activeRing?.name}`;
      
      localStorage.setItem(storageKey, selectedOption);
    }
  }, [selectedOption, activeRing]);

  return (
    <div>
      <h3 className="m-0 font-semibold text-sm text-black">
        Stone color and purity
      </h3>
      <div className="flex flex-col mt-1 bg-white px-6 py-4 ">
        {[
          `E / IF (Colourless+ / flawless)`,
          `G / VS (Near colourless / very slightly included)`,
          `G / SI (Near colourless / slightly included)`,
          `Cubic zirconia AAA (white / very good)`,
        ].map((option) => (
          <label
            key={option}
            className="block relative pl-9 mb-3 text-sm cursor-pointer select-none"
          >
            {option}
            <input
              type="radio"
              name="radio"
              value={option}
              checked={selectedOption === option}
              onChange={(e) => {
                handleChange(e);
                // Also send message to parent window when changed
                window.parent.postMessage(
                  { action: "stoneColorPurity", value: e.target.value },
                  "*"
                );
              }}
              className="absolute opacity-0 cursor-pointer"
            />
            <span
              className={`absolute top-0 left-0 h-6 w-6 rounded-full ${
                selectedOption === option ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              {selectedOption === option && (
                <span className="block absolute top-2 left-2 w-2 h-2 bg-white rounded-full" />
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StoneColorPurity;