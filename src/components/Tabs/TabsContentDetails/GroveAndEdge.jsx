import { useState } from "react";
import { PreciousMetalSelectBox } from "./PreciousMetal/PreciousMetalSelectBox";
import DistributionImg1 from "../../../../public/profile/none.svg";
import DistributionImg2 from "../../../../public/profile/two-color.svg";
import DistributionImg3 from "../../../../public/profile/three-color.svg";

const DistributionOptions = [
  { name: "Single", img: DistributionImg1, disabled: false },
  { name: "Two tone", img: DistributionImg2, disabled: false },
  { name: "Tri Colored", img: DistributionImg3, disabled: false },
];

export const GroveAndEdge = ({ isPair, toggleIsPair }) => {
  const [groove, setGroove] = useState("Without");
  const [activeTab, setActiveTab] = useState("grooves");
  const [subActiveTab, setSubActiveTab] = useState("choice_of_groove");

  const grooveOption = [
    "Without",
    "V-groove",
    "U-groove",
    "Square groove",
    "Milgrain",
  ];

  const [leftEdge, setLeftEdge] = useState("Without");

  const leftEdgeOption = ["Without", "Edge", "Milgrain"];

  const widthOptions = [{ value: "0.65 mm" }];

  const [selectedLeftWidthOption, setSelectedLeftWidthOption] = useState(
    widthOptions[0].value
  );

  return (
    <div className="mb-auto">
      <div className="py-3 flex items-center bg-white">
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
          className="mr-2"
        />
        <label className="text-sm font-semibold">
          Use the same settings for both rings
        </label>
      </div>

      {/* Tab buttons */}
      <div className="bg-[#e1e1e1] flex">
        <button
          onClick={() => setActiveTab("grooves")}
          className={`py-3 px-5 font-semibold ${
            activeTab === "grooves" ? "bg-[#f9f9fa] text-black text-lg" : ""
          }`}
        >
          Grooves
        </button>
        <button
          onClick={() => setActiveTab("steps")}
          className={`py-3 px-5 font-semibold ${
            activeTab === "steps" ? "bg-[#f9f9fa] text-black text-lg" : ""
          }`}
        >
          Steps
        </button>
      </div>

      {/* Content for Grooves Tab */}
      {activeTab === "grooves" && (
        <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
          <div className="">
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
          </div>
          {subActiveTab === "choice_of_groove" && (
            <div className="mt-5">
              <label className="block font-semibold">Choice of groove</label>
              <div className="flex items-start space-x-2">
                {DistributionOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setGroove(item)}
                    className={`bg-white w-full border ${
                      item.disabled && "opacity-30"
                    } ${
                      "partition.name" === item.name
                        ? "border-[#205fa8]"
                        : "border-[#e1e1e1]"
                    }`}
                  >
                    <span>{item.name}</span>
                    <img
                      src={item.img}
                      className="mx-auto mt-5"
                      alt={item.name}
                    />
                  </button>
                ))}
              </div>

              <label className="block mt-5 mb-2">Edge</label>

              <label className="block mt-2 mb-2">Left</label>
              <div className="flex items-start space-x-2">
                {leftEdgeOption.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setLeftEdge(item)}
                    className={`w-16 h-16 text-center border rounded-lg ${
                      leftEdge === item
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {leftEdge !== "Without" && (
            <div className="flex flex-row space-x-4 mt-4">
              <div>
                <label htmlFor="edge-width" className="block mb-2">
                  Width
                </label>
                <PreciousMetalSelectBox
                  isImageLess
                  options={widthOptions}
                  selectedOption={selectedLeftWidthOption}
                  setSelectedOption={setSelectedLeftWidthOption}
                />
              </div>

              <div>
                <label htmlFor="edge-width" className="block mb-2">
                  Depth
                </label>
                <PreciousMetalSelectBox
                  isImageLess
                  options={widthOptions}
                  selectedOption={selectedLeftWidthOption}
                  setSelectedOption={setSelectedLeftWidthOption}
                />
              </div>

              <div>
                <label htmlFor="edge-width" className="block mb-2">
                  Surface
                </label>
                <PreciousMetalSelectBox
                  isImageLess
                  options={widthOptions}
                  selectedOption={selectedLeftWidthOption}
                  setSelectedOption={setSelectedLeftWidthOption}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content for Steps Tab */}
      {activeTab === "steps" && (
        <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
          <label htmlFor="steps" className="block mb-2">
            Steps Content (Custom content can go here)
          </label>
          {/* Add your step-related content here */}
        </div>
      )}
    </div>
  );
};
