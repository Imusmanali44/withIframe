window.distribution = "Together";

import { useState } from "react";
import { AddSvg, TrashSvg } from "../../../../static/SvgImages";
import StoneColorPurity from "./StoneColorPurity";
// stone style image
import StoneStyleWithout from "../../../../assets/images/StoneSetting/stoneStyle/none.svg";
import StoneStyleSmooth from "../../../../assets/images/StoneSetting/stoneStyle/bezel.svg";
import StoneStylePave from "../../../../assets/images/StoneSetting/stoneStyle/section.svg";
import StoneStyleRailSetting from "../../../../assets/images/StoneSetting/stoneStyle/channel.svg";
import StoneStyleRailSettingAcross from "../../../../assets/images/StoneSetting/stoneStyle/cross-channel.svg";
import StoneStyleSmoothConversionSide from "../../../../assets/images/StoneSetting/stoneStyle/side-bezel.svg";
import StoneStylePavedSide from "../../../../assets/images/StoneSetting/stoneStyle/side-section.svg";
import StoneStyleChannelAside from "../../../../assets/images/StoneSetting/stoneStyle/side-channel.svg";
import StoneStyleFreeLayout from "../../../../assets/images/StoneSetting/stoneStyle/free.svg";
import StoneStyleTensionRing from "../../../../assets/images/StoneSetting/stoneStyle/clamping-open.svg";
import StoneStyleTensionRingDiagonally from "../../../../assets/images/StoneSetting/stoneStyle/clamping-diagonal.svg";
import StoneStyleCanalAround from "../../../../assets/images/StoneSetting/stoneStyle/open-channel.svg";


// stone type image
import StoneTypeBrilliant from "../../../../assets/images/StoneSetting/stoneType/brilliant.svg";
import StoneTypePrincess from "../../../../assets/images/StoneSetting/stoneType/princess.svg";
import StoneTypeBaguette from "../../../../assets/images/StoneSetting/stoneType/baguette.svg";
// position image
import StoneSettingPositionLeft from "../../../../assets/images/StoneSetting/position/left.svg";
import StoneSettingPositionMiddle from "../../../../assets/images/StoneSetting/position/center.svg";
import StoneSettingPositionRight from "../../../../assets/images/StoneSetting/position/right.svg";
import StoneSettingPositionFree from "../../../../assets/images/StoneSetting/position/free.svg";

import {StoneRangeSlider} from "../../../shared/StoneRangeSlider";

const maxStonesPerDistribution = {
  'Together': 8,
  'Half stone distance': 12,
  'Whole stone distance': 15,
  'Double stone spacing': 20,
  'A third ring': 30,
  'Half ring': 50,
  'Whole ring': 69
};
  const RingStoneStyleOptions = [
    {
      name: "Without",
      img: StoneStyleWithout,
      disabled: false
    },
    {
      name: "Smooth conversion",
      img: StoneStyleSmooth,
      disabled: false
    },
    {
      name: "Pavé",
      img: StoneStylePave,
      disabled: false
    },
    {
      name: "Rail setting",
      img: StoneStyleRailSetting,
      disabled: false
    },
    {
      name: "Rail setting across",
      img: StoneStyleRailSettingAcross,
      disabled: true
    },
    {
      name: "Smooth conversion side",
      img: StoneStyleSmoothConversionSide,
      disabled: true
    },
    {
      name: "Paved side",
      img: StoneStylePavedSide,
      disabled: true
    },
    {
      name: "Channel side",
      img: StoneStyleChannelAside,
      disabled: true
    },
    {
      name: "Free layout",
      img: StoneStyleFreeLayout,
      disabled: true
    },
    {
      name: "Tension ring",
      img: StoneStyleTensionRing,
      disabled: true
    },
    {
      name: "Tension ring diagonally",
      img: StoneStyleTensionRingDiagonally,
      disabled: true
    },
    {
      name: "Canal around",
      img: StoneStyleCanalAround,
      disabled: true
    },
  ];
  
  // Modified RingStoneTypeOptions array
  const RingStoneTypeOptions = [
    {
      name: "Brilliant",
      img: StoneTypeBrilliant,
      disabled: false
    },
    {
      name: "Princess",
      img: StoneTypePrincess,
      disabled: true
    },
    {
      name: "Baguette",
      img: StoneTypeBaguette,
      disabled: true
    },
  ];

const PositionTypeOptions = [
  {
    name: "Left",
    img: StoneSettingPositionLeft,
  },
  {
    name: "Middle",
    img: StoneSettingPositionMiddle,
  },
  {
    name: "Right",
    img: StoneSettingPositionRight,
  },
  {
    name: "Free",
    img: StoneSettingPositionFree,
  },
];

const StoneSizeOptions = [
  "0.005 ct. (Ø 1.0 mm)",
  "0.005 ct. (Ø 1.3 mm)",
  "0.005 ct. (Ø 1.5 mm)",
];

const DistributionOptions = [
  "Together",
  "Half stone distance",
  "Whole stone distance",
  "Double stone spacing",
  "A third ring",
  "Half ring",
  "Whole ring",
];

const StonesPerGroupOptions = ["2 (2)", "3 (3)", "4 (4)", "5 (5)"];

const DivisionGroupsOptions = [
  "Half stone distance",
  "Whole stone distance",
  "Double stone spacing",
  "A third ring",
  "Half ring",
  "Whole ring",
];

const TabButton = ({ label, currentTab, setTab }) => (
  <button
    onClick={() => setTab(label)}
    className={`font-semibold ${
      currentTab === label
        ? "text-[#205fa8] border-b border-[#205fa8]"
        : "text-[#626262]"
    }`}
  >
    {label}
  </button>
);

const TabContent = ({
  activeTab,
  stones,
  addStone,
  removeStone,
  stoneSize,
  setStoneSize,
  selectedOption,
  handleChange,
}) => {
  const [currentTab, setCurrentTab] = useState("Settings");
  const [stoneStyle, setStoneStyle] = useState("Without");
  const [stoneType, setStoneType] = useState("Without");
  const [stoneNumber, setStoneNumber] = useState("1");
  const [distribution, setDistribution] = useState("Together");
  const [isGrouped, setIsGrouped] = useState(false);
  const [stonesPerGroup, setStonesPerGroup] = useState("");
  const [groupDivision, setGroupDivision] = useState("");

  const handleCheckboxChange = (e) => {
    setIsGrouped(e.target.checked);
  };
  console.log(1, stoneNumber);

  const renderTabContent = () => {
    switch (currentTab) {
      case "Settings":
        return (
          <div className="flex flex-wrap gap-2.5">
            {RingStoneStyleOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled) {
                    window.parent.postMessage(
                      { action: "addStone", value: item.name },
                      "*"
                    );
                    console.log(`Clicked: ${item.name}, Index: ${index}`);
                    setStoneStyle(item.name);
                  }
                }}
                className={`bg-white w-[calc(34%-10px)] lg:w-[calc(25%-10px)] border flex flex-col justify-between items-center pt-3 
                  ${item.disabled 
                    ? "opacity-40 cursor-not-allowed border-[#e1e1e1] bg-gray-50" 
                    : `hover:border-[#205fa8] ${stoneStyle === item.name ? "border-[#205fa8]" : "border-[#e1e1e1]"}`
                  }`}
                disabled={item.disabled}
              >
                <span className={`mx-2 text-sm leading-none ${item.disabled ? "text-gray-400" : ""}`}>
                  {item.name}
                </span>
                <div className={`${item.disabled ? "opacity-30" : ""}`}>
                  <img src={item.img} className="mx-auto mt-3" alt={item.name} />
                </div>
              </button>
            ))}
          </div>
        );
      case "Type of Stone":
        return (
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-sm text-black">
                Grinding
              </h3>
              <div className="flex items-start space-x-2">
                {RingStoneTypeOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.disabled) {
                        setStoneType(item.name);
                      }
                    }}
                    className={`bg-white w-full border p-2 
                      ${item.disabled 
                        ? "opacity-40 cursor-not-allowed border-[#e1e1e1] bg-gray-50" 
                        : `${stoneType === item.name ? "border-[#205fa8]" : "border-[#e1e1e1]"}`
                      }`}
                    disabled={item.disabled}
                  >
                    <span className={`text-sm ${item.disabled ? "text-gray-400" : ""}`}>
                      {item.name}
                    </span>
                    <div className={`${item.disabled ? "opacity-30" : ""}`}>
                      <img
                        src={item.img}
                        className="mx-auto mt-1 w-16 h-16"
                        alt={item.name}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-sm text-black">
                Stone size
              </h3>
              <select
                value={stoneSize}
                onChange={(e) => {setStoneSize(e.target.value), console.log(`Clicked size ${e.target.value}`),
                window.parent.postMessage(
                  { action: "stoneSize", value: e.target.value },
                  "*"
                );}}
                className="border border-[#e1e1e1] p-2 rounded w-full"
              >
                {StoneSizeOptions.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <StoneColorPurity
              selectedOption={selectedOption}
              handleChange={handleChange}
            />
          </div>
        );
        case "Number":
          return (
            <div className="flex flex-col">
              <div className="flex mb-6 gap-6">
                <div className="w-1/2">
                  <h3 className="mb-2 font-semibold text-sm text-black">
                    Number
                  </h3>
                  <select
                    value={stoneNumber}
                    onChange={(e) => {
                      setStoneNumber(e.target.value),
                      window.parent.postMessage(
                        { action: "addStone", value: e.target.value, type: "Number", stoneDist: window.distribution },
                        "*")
                    }}
                    className="border border-[#e1e1e1] p-2 rounded w-full"
                  >
                    {Array.from(
                      { length: maxStonesPerDistribution[distribution] || 70 }, 
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`flex flex-col mt-2 ${
                      stoneNumber === "1" && "cursor-not-allowed"
                    }`}
                  >
                    <label
                      className={`block relative text-sm font-semibold ${
                        stoneNumber === "1"
                          ? "select-none opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {/* Arrange stones as a group */}
                    </label>
                  </div>
                </div>
                {stoneNumber > 1 && (
                  <div className="w-1/2">
                    <h3 className="mb-2 font-semibold text-sm text-black">
                      Distribution
                    </h3>
                    <select
                      value={distribution}
                      onChange={(e) => {
                        setDistribution(e.target.value),
                        window.distribution = e.target.value,
                        console.log(`Clicked distribution ${window.distribution}`);
                        
                        // If current stone number exceeds max for new distribution, adjust it
                        const maxForNewDistribution = maxStonesPerDistribution[e.target.value] || 70;
                        if (parseInt(stoneNumber) > maxForNewDistribution) {
                          setStoneNumber(String(maxForNewDistribution));
                          window.parent.postMessage(
                            { action: "addStone", value: String(maxForNewDistribution), type: "Number", stoneDist: e.target.value },
                            "*");
                        }
                      }}
                      className="border border-[#e1e1e1] p-2 rounded w-full"
                    >
                      {DistributionOptions.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Max stones: {maxStonesPerDistribution[distribution] || 70}
                    </p>
                  </div>
                )}
              </div>
              {isGrouped && (
                <div className="flex gap-4 mb-6">
                  <div className="w-2/5">
                    <h3 className="mb-2 font-semibold text-sm text-black">
                      Stones per Group
                    </h3>
                    <select
                      value={stonesPerGroup}
                      onChange={(e) => setStonesPerGroup(e.target.value)}
                      className="border border-[#e1e1e1] p-2 rounded w-full"
                    >
                      {/* Options for stones per group */}
                      {StonesPerGroupOptions.map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
        
                  <div className="w-3/5">
                    <h3 className="mb-2 font-semibold text-sm text-black">
                      Division of Groups
                    </h3>
                    <select
                      value={groupDivision}
                      onChange={(e) => setGroupDivision(e.target.value)}
                      className="border border-[#e1e1e1] p-2 rounded w-full"
                    >
                      {/* Options for division of groups */}
                      {DivisionGroupsOptions.map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className="mb-2 block font-semibold text-sm text-black">
                  Position
                </label>
  <div className="flex flex-wrap gap-2.5">
    {PositionTypeOptions.map((item, index) => (
      <button
        key={index}
        onClick={() => {
          setStoneStyle(item.name);
          console.log(`Clicked position ${item.name}`);
          window.parent.postMessage(
            { action: "stonePosition", value: item.name },
            "*"
          );
        }}
        className={`bg-white w-[calc(34%-10px)] lg:w-[calc(25%-10px)] border flex flex-col justify-between items-center pt-3 hover:border-[#205fa8] ${
          stoneStyle === item.name
            ? "border-[#205fa8]"
            : "border-[#e1e1e1]"
        }`}
      >
        <span className="mx-2 text-sm leading-none">
          {item.name}
        </span>
        <img
          src={item.img}
          className="mx-auto mt-3"
          alt={item.name}
        />
      </button>
    ))}
  </div>
  
  {/* Render the FreePositionComponent when "Free" position is selected */}
  {stoneStyle === "Free" && <StoneRangeSlider />}
</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      {/* Add and remove stone buttons */}
      <div className="flex items-center gap-5">
        {/* {stones.length < 3 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={addStone}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <AddSvg />
            </div>
            Add stone group
          </div>
        )} */}
        {stones.length > 1 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => removeStone(activeTab)}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <TrashSvg className={"text-inherit w-6"} />
            </div>
            Remove stone group
          </div>
        )}
      </div>
      <div className="flex gap-5 my-6">
        <TabButton
          label="Settings"
          currentTab={currentTab}
          setTab={setCurrentTab}
        />
        <TabButton
          label="Type of Stone"
          currentTab={currentTab}
          setTab={setCurrentTab}
        />
        <TabButton
          label="Number"
          currentTab={currentTab}
          setTab={setCurrentTab}
        />
      </div>

      {renderTabContent()}
    </div>
  );
};

export default TabContent;
