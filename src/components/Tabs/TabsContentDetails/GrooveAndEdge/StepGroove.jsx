import { useState } from "react";
import WidthDepthSurface from "./WidthDepthSurface";
import { TrashSvg, AddSvg } from "../../../../static/SvgImages";
import { GrooveRangeSlider } from "../../../shared/GrooveRangeSlider";

const DistributionOptions = [
  {
    name: "Without",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/none.svg",
  },
  {
    name: "V-groove",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/v-groove-90.svg",
  },
  {
    name: "U-groove",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/u-groove.svg",
  },
  {
    name: "Corner joint",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/square-groove.svg",
  },
  {
    name: "Milgrain",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/perlage.svg",
  },
];

const StepGroove = ({
  activeRing,
  selectedGrooveOptions,
  setSelectedGrooveOptions,
}) => {
  const [groove, setGroove] = useState("Without");
  const [subActiveTab, setSubActiveTab] = useState("choice_of_groove");

  const [ring1Grooves, setRing1Grooves] = useState([
    { id: 1, name: "Free Groove" },
  ]);
  const [ring2Grooves, setRing2Grooves] = useState([
    { id: 1, name: "Free Groove" },
  ]);

  const handleGrooveSelection = (item) => {
    setGroove(item.name);
    window.parent.postMessage({ action: 'addGroove', type: item.name }, "*");
  };

  const addGrooveRing1 = () => {
    const newId = ring1Grooves.length + 1;
    setRing1Grooves([...ring1Grooves, { id: newId, name: "Free Groove" }]);
    window.parent.postMessage(
      { action: "addGroove", value: newId, type: "defaultAdd", selectedRing: "Ring 1" },
      "*"
    );
  };

  const addGrooveRing2 = () => {
    const newId = ring2Grooves.length + 1;
    setRing2Grooves([...ring2Grooves, { id: newId, name: "Free Groove" }]);
    window.parent.postMessage(
      { action: "addGroove", value: newId, type: "defaultAdd", selectedRing: "Ring 2" },
      "*"
    );
  };

  const removeGrooveRing1 = (id) => {
    setRing1Grooves(ring1Grooves.filter((groove) => groove.id !== id));
    window.parent.postMessage(
      { action: "addGroove", type: "defaultDelete", selectedRing: "Ring 1" },
      "*"
    );
  };

  const removeGrooveRing2 = (id) => {
    setRing2Grooves(ring2Grooves.filter((groove) => groove.id !== id));
    window.parent.postMessage(
      { action: "addGroove", type: "defaultDelete", selectedRing: "Ring 2" },
      "*"
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      {/* Tab buttons */}
      <div>
        <button
          className={`font-semibold mr-5 ${
            subActiveTab === "choice_of_groove"
              ? "text-[#205fa8ff] border-b border-[#205fa8ff]"
              : ""
          }`}
          onClick={() => setSubActiveTab("choice_of_groove")}
        >
          Choice of Groove
        </button>
        {groove !== "Without" && (
          <button
            className={`font-semibold mr-5 ${
              subActiveTab === "position"
                ? "text-[#205fa8ff] border-b border-[#205fa8ff]"
                : ""
            }`}
            onClick={() => setSubActiveTab("position")}
          >
            Position
          </button>
        )}
      </div>

      {/* Choice of groove tab content */}
      {subActiveTab === "choice_of_groove" && (
        <div className="mt-5">
          <label className="text-sm block font-semibold py-1">
            Choice of groove
          </label>
          <div className="flex items-start space-x-2">
            {DistributionOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleGrooveSelection(item)}
                className={`bg-white w-full border ${
                  groove === item.name ? "border-[#205fa8]" : "border-[#e1e1e1]"
                }`}
              >
                <span className="text-sm">{item.name}</span>
                <img src={item.img} className="mx-auto mt-5" alt={item.name} />
              </button>
            ))}
          </div>
          {groove !== "Without" && (
            <WidthDepthSurface
              groove={groove}
              selectedOptions={selectedGrooveOptions}
              setSelectedOptions={setSelectedGrooveOptions}
            />
          )}
        </div>
      )}

      {/* Position tab content */}
      {subActiveTab === "position" && (
        <div className="mt-5">
          <div className="flex flex-row space-x-4">
            {/* Ring 1 */}
            <div className={activeRing.type === "Wedding" ? "w-1/2" : "w-full"}>
              <label className="block font-semibold py-1">Ring 1</label>
              {ring1Grooves.map((grooveItem) => (
                <div className="flex items-center mb-2.5" key={grooveItem.id}>
                  <span className="w-7 h-7 flex items-center justify-center">
                    {grooveItem.id}
                  </span>
                  <div className="border px-2.5 py-2 w-full flex items-center justify-between bg-white">
                    <span>{grooveItem.name}</span>
                    <TrashSvg
                      className="cursor-pointer"
                      onClick={() => removeGrooveRing1(grooveItem.id)}
                    />
                  </div>
                </div>
              ))}
              <div
                className="flex items-center ml-7 cursor-pointer"
                onClick={addGrooveRing1}
              >
                <div className="bg-white rounded-full mr-2 border border-[#e1e1e1] w-7 h-7 flex justify-center items-center">
                  <AddSvg />
                </div>
                <span className="text-sm">Add another groove</span>
              </div>
            </div>

            {/* Ring 2 */}
            {activeRing.type === "Wedding" && window.ringsLength === 2 && (
              <div className="w-1/2">
                <label className="block font-semibold py-1">Ring 2</label>
                {ring2Grooves.map((grooveItem) => (
                  <div className="flex items-center mb-2.5" key={grooveItem.id}>
                    <span className="w-7 h-7 flex items-center justify-center">
                      {grooveItem.id}
                    </span>
                    <div className="border px-2.5 py-2 w-full flex items-center justify-between bg-white">
                      <span>{grooveItem.name}</span>
                      <TrashSvg
                        className="cursor-pointer"
                        onClick={() => removeGrooveRing2(grooveItem.id)}
                      />
                    </div>
                  </div>
                ))}
                <div
                  className="flex items-center ml-7 cursor-pointer"
                  onClick={addGrooveRing2}
                >
                  <div className="bg-white rounded-full mr-2 border border-[#e1e1e1] w-7 h-7 flex justify-center items-center">
                    <AddSvg />
                  </div>
                  <span className="text-sm">Add another groove</span>
                </div>
              </div>
            )}
          </div>

          {/* Sliders */}
          <div className="mt-4">
  <GrooveRangeSlider
    title="Ring 1"
    grooves={ring1Grooves}
    min={-0.85}
    max={-0.55}
    step={0.001}
    defaultValue={-0.7}
  />
</div>
{activeRing.type === "Wedding" && window.ringsLength === 2 && (
  <div className="mt-4">
    <GrooveRangeSlider
      title="Ring 2"
      grooves={ring2Grooves}
      min={0.55}
      max={0.85}
      step={0.001}
      defaultValue={0.7}
    />
  </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepGroove;