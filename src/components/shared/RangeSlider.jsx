import { useState } from "react";

export const RangeSlider = ({
  title,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    console.log(newValue);
  };

  return (
    <div className="flex flex-col items-center justify-start mt-4">
      <label
        htmlFor="dynamic-range-slider"
        className="font-medium text-start py-1"
      >
        {title}: {value}
      </label>
      <div className="bg-white w-full px-2.5 py-7">
        <input
          id="dynamic-range-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none slider-thumb"
        />
      </div>
    </div>
  );
};
