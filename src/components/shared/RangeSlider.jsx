import { useState, useEffect } from "react";

import IsPair from "./IsPair";
import { TopBar } from "../Configurator/TopBar";

export const RangeSlider = ({
  title= "Ring 1",
  min = -1,
  max = 1,
  step = 0.001,
  defaultValue =0 
}) => {
  // if(min==-1){
  //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  // }
  if(window.selectedRing==1 && window.ringsLength==2){
    title= "Ring 1",
  min = -0.85,
  max = -0.55,
  step = 0.001,
  defaultValue =-0.7 
  }
  if(window.selectedRing==2 && window.ringsLength==2){
    title= "Ring 2",
    max = 0.85,
    min = 0.55,
    step = 0.001,
    defaultValue =0.7
  }
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    console.log(newValue,"pair", window.pair1, "ringselect", window.selectedRing,min,max);
    window.parent.postMessage(
      { action: "changeSlider", value: newValue },
      "*"
    );
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
