import { useState, useEffect } from "react";
import { AddSvg, TrashSvg } from "../../../../static/SvgImages";
import StoneColorPurity from "./StoneColorPurity";
import { useLocalization } from "../../../../context/LocalizationContext";
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

// Initialize global distribution variable if it doesn't exist
if (typeof window !== 'undefined' && window.distribution === undefined) {
  window.distribution = "Together";
}

// Helper function to get distribution translation key
const getDistributionKey = (distribution) => {
  switch (distribution) {
    case "Together": return "together";
    case "Half stone distance": return "halfStoneDistance";
    case "Whole stone distance": return "wholeStoneDistance";
    case "Double stone spacing": return "doubleStoneSpacing";
    case "A third ring": return "aThirdRing";
    case "Half ring": return "halfRing";
    case "Whole ring": return "wholeRing";
    default: return distribution;
  }
};

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
      name: "Smooth Stone",
      img: StoneStyleSmooth,
      disabled: false
      // StoneStyleRailSettingAcross
    },
    {
      name: "Rail setting Across",
      img: StoneStyleRailSettingAcross,
      disabled: true
      // StoneStyleSmoothConversionSide,
    },
    {
      name: "Smooth setting Across",
      // img: StoneStylePavedSide,
      img: StoneStyleRailSettingAcross,
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

const TabButton = ({ label, currentTab, setTab }) => {
  const { t } = useLocalization();
  
  // Map raw labels to translation keys
  const getTranslationKey = (rawLabel) => {
    switch(rawLabel) {
      case "Settings": return 'stone.tabs.settings';
      case "Type of Stone": return 'stone.tabs.typeOfStone';
      case "Number": return 'stone.tabs.number';
      default: return rawLabel;
    }
  };
  
  return (
    <button
      onClick={() => setTab(label)}
      className={`font-semibold ${
        currentTab === label
          ? "text-[#205fa8] border-b border-[#205fa8]"
          : "text-[#626262]"
      }`}
    >
      {t(getTranslationKey(label))}
    </button>
  );
};

const TabContent = ({
  activeTab,
  stones,
  addStone,
  removeStone,
  stoneSize,
  setStoneSize,
  selectedOption,
  handleChange,
  activeRing
}) => {
  const { t } = useLocalization();
  
  // Helper function to get translated stone style name
  const getStoneStyleTranslation = (name) => {
    switch(name) {
      case "Without": return t('stone.stoneOptions.without');
      case "Smooth conversion": return t('stone.stoneOptions.smoothConversion');
      case "Pavé": return t('stone.stoneOptions.pave');
      case "Rail setting": return t('stone.stoneOptions.railSetting');
      case "Smooth Stone": return t('stone.stoneOptions.smoothStone');
      case "Rail setting Across": return t('stone.stoneOptions.railSettingAcross');
      case "Smooth setting Across": return t('stone.stoneOptions.smoothSettingAcross');
      case "Channel side": return t('stone.stoneOptions.channelSide');
      case "Free layout": return t('stone.stoneOptions.freeLayout');
      case "Tension ring": return t('stone.stoneOptions.tensionRing');
      case "Tension ring diagonally": return t('stone.stoneOptions.tensionRingDiagonally');
      case "Canal around": return t('stone.stoneOptions.canalAround');
      default: return name;
    }
  };
  
  // Helper function to get translated stone type name
  const getStoneTypeTranslation = (name) => {
    switch(name) {
      case "Brilliant": return t('stone.stoneType.brilliant');
      case "Princess": return t('stone.stoneType.princess');
      case "Baguette": return t('stone.stoneType.baguette');
      default: return name;
    }
  };
  
  // Helper function to get translated position name
  const getPositionTranslation = (name) => {
    switch(name) {
      case "Left": return t('stone.positions.left');
      case "Middle": return t('stone.positions.middle');
      case "Right": return t('stone.positions.right');
      case "Free": return t('stone.positions.free');
      default: return name;
    }
  };
  
  // Track ring changes
  const [currentRingKey, setCurrentRingKey] = useState(() => {
    return Array.isArray(activeRing) 
      ? `${activeRing[0]?.name}_${activeRing[1]?.name}`
      : `${activeRing?.name}`;
  });

  // Create storage key prefix based on activeRing and activeTab
  const getStorageKeyPrefix = () => {
    const ringKey = Array.isArray(activeRing) 
      ? `${activeRing[0]?.name}_${activeRing[1]?.name}`
      : `${activeRing?.name}`;
    
    return `stone_${ringKey}_tab${activeTab}`;
  };

  // Initialize state from localStorage or defaults
  const [currentTab, setCurrentTab] = useState("Settings");
  const [stoneStyle, setStoneStyle] = useState("Without");
  const [stoneType, setStoneType] = useState("Without");
  const [stoneNumber, setStoneNumber] = useState("1");
  const [distribution, setDistribution] = useState("Together");
  const [isGrouped, setIsGrouped] = useState(false);
  const [stonesPerGroup, setStonesPerGroup] = useState("");
  const [groupDivision, setGroupDivision] = useState("");

  // Initialize state based on current ring/tab when component mounts
  useEffect(() => {
    loadStateForCurrentRing();
  }, []);

  // Function to load state for the current ring
  const loadStateForCurrentRing = () => {
    if (!activeRing || !activeTab) return;
    
    const prefix = getStorageKeyPrefix();
    
    // Load currentTab
    const savedTab = localStorage.getItem(`${prefix}_currentTab`);
    setCurrentTab(savedTab || "Settings");
    
    // Load stoneStyle
    const savedStyle = localStorage.getItem(`${prefix}_stoneStyle`);
    setStoneStyle(savedStyle || "Without");
    
    // Load stoneType
    const savedType = localStorage.getItem(`${prefix}_stoneType`);
    setStoneType(savedType || "Without");
    
    // Load stoneNumber
    const savedNumber = localStorage.getItem(`${prefix}_stoneNumber`);
    setStoneNumber(savedNumber || "1");
    
    // Load distribution
    const savedDist = localStorage.getItem(`${prefix}_distribution`);
    if (savedDist) {
      setDistribution(savedDist);
      window.distribution = savedDist;
    } else {
      setDistribution("Together");
      window.distribution = "Together";
    }
    
    // Load isGrouped
    const savedGrouped = localStorage.getItem(`${prefix}_isGrouped`);
    setIsGrouped(savedGrouped === "true");
    
    // Load stonesPerGroup
    const savedStonesPerGroup = localStorage.getItem(`${prefix}_stonesPerGroup`);
    setStonesPerGroup(savedStonesPerGroup || "");
    
    // Load groupDivision
    const savedDivision = localStorage.getItem(`${prefix}_groupDivision`);
    setGroupDivision(savedDivision || "");
  };

  // Effect to detect ring or tab changes
  useEffect(() => {
    const newRingKey = Array.isArray(activeRing) 
      ? `${activeRing[0]?.name}_${activeRing[1]?.name}`
      : `${activeRing?.name}`;
    
    if (newRingKey !== currentRingKey || !currentRingKey) {
      setCurrentRingKey(newRingKey);
      loadStateForCurrentRing();
      
      // Notify parent about stone settings for this ring
      if (stoneStyle !== "Without") {
        window.parent.postMessage(
          { action: "addStone", value: stoneStyle, ringKey: newRingKey },
          "*"
        );
      }
    }
  }, [activeRing, activeTab]);

  // Save states to localStorage when they change
  useEffect(() => {
    if (!activeRing || !activeTab) return;
    const prefix = getStorageKeyPrefix();
    
    localStorage.setItem(`${prefix}_currentTab`, currentTab);
    localStorage.setItem(`${prefix}_stoneStyle`, stoneStyle);
    localStorage.setItem(`${prefix}_stoneType`, stoneType);
    localStorage.setItem(`${prefix}_stoneNumber`, stoneNumber);
    localStorage.setItem(`${prefix}_distribution`, distribution);
    localStorage.setItem(`${prefix}_isGrouped`, isGrouped.toString());
    localStorage.setItem(`${prefix}_stonesPerGroup`, stonesPerGroup);
    localStorage.setItem(`${prefix}_groupDivision`, groupDivision);
    
    // Update global distribution
    window.distribution = distribution;
  }, [
    currentTab, 
    stoneStyle, 
    stoneType, 
    stoneNumber, 
    distribution, 
    isGrouped,
    stonesPerGroup,
    groupDivision,
    activeRing,
    activeTab
  ]);

  const handleCheckboxChange = (e) => {
    setIsGrouped(e.target.checked);
  };

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
                      { 
                        action: "addStone", 
                        value: item.name,
                        ringKey: currentRingKey
                      },
                      "*"
                    );
                    console.log(`Clicked: ${item.name}, Index: ${index}, Ring: ${currentRingKey}`);
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
                  {getStoneStyleTranslation(item.name)}
                </span>
                <div className={`${item.disabled ? "opacity-30" : ""}`}>
                  <img src={item.img} className="mx-auto mt-3" alt={item.name} />
                </div>
              </button>
            ))}
          </div>
        );
        
      case "Type of Stone":
        // Type of Stone content remains the same, but add ringKey to postMessage
        return (
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-sm text-black">
                {t('stone.grinding')}
              </h3>
              <div className="flex items-start space-x-2">
                {RingStoneTypeOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.disabled) {
                        setStoneType(item.name);
                        // Add postMessage with ringKey
                        window.parent.postMessage(
                          { 
                            action: "stoneType", 
                            value: item.name,
                            ringKey: currentRingKey
                          },
                          "*"
                        );
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
                      {getStoneTypeTranslation(item.name)}
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
                {t('stone.stoneSize')}
              </h3>
              <select
                value={stoneSize}
                onChange={(e) => {
                  setStoneSize(e.target.value);
                  console.log(`Clicked size ${e.target.value}, Ring: ${currentRingKey}`);
                  window.parent.postMessage(
                    { 
                      action: "stoneSize", 
                      value: e.target.value,
                      ringKey: currentRingKey
                    },
                    "*"
                  );
                  
                  // Save to localStorage directly
                  if (activeRing) {
                    const storageKey = Array.isArray(activeRing) 
                      ? `stoneSize_${activeRing[0]?.name}_${activeRing[1]?.name}` 
                      : `stoneSize_${activeRing?.name}`;
                    
                    localStorage.setItem(storageKey, e.target.value);
                  }
                }}
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
              activeRing={activeRing}
            />
          </div>
        );
        
      case "Number":
        // Number content remains the same, but add ringKey to postMessage
        return (
          <div className="flex flex-col">
            <div className="flex mb-6 gap-6">
              <div className="w-1/2">
                <h3 className="mb-2 font-semibold text-sm text-black">
                  {t('stone.number')}
                </h3>
                <select
                  value={stoneNumber}
                  onChange={(e) => {
                    setStoneNumber(e.target.value);
                    window.parent.postMessage(
                      { 
                        action: "addStone", 
                        value: e.target.value, 
                        type: "Number", 
                        stoneDist: window.distribution,
                        ringKey: currentRingKey
                      },
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
                    {t('stone.arrangeGroup')}
                  </label>
                </div>
              </div>
              {stoneNumber > 1 && (
                <div className="w-1/2">
                  <h3 className="mb-2 font-semibold text-sm text-black">
                    {t('stone.distribution')}
                  </h3>
                  <select
                    value={distribution}
                    onChange={(e) => {
                      setDistribution(e.target.value);
                      window.distribution = e.target.value;
                      console.log(`Clicked distribution ${window.distribution}, Ring: ${currentRingKey}`);
                      
                      // If current stone number exceeds max for new distribution, adjust it
                      const maxForNewDistribution = maxStonesPerDistribution[e.target.value] || 70;
                      if (parseInt(stoneNumber) > maxForNewDistribution) {
                        setStoneNumber(String(maxForNewDistribution));
                        window.parent.postMessage(
                          { 
                            action: "addStone", 
                            value: String(maxForNewDistribution), 
                            type: "Number", 
                            stoneDist: e.target.value,
                            ringKey: currentRingKey
                          },
                          "*");
                      } else {
                        // Also notify about distribution change even if stone number doesn't change
                        window.parent.postMessage(
                          { 
                            action: "updateDistribution", 
                            value: e.target.value,
                            ringKey: currentRingKey 
                          },
                          "*");
                      }
                    }}
                    className="border border-[#e1e1e1] p-2 rounded w-full"
                  >
                    {DistributionOptions.map((size, index) => (
                      <option key={index} value={size}>
                        {t(`stone.distributions.${getDistributionKey(size)}`)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('stone.maxStones')} {maxStonesPerDistribution[distribution] || 70}
                  </p>
                </div>
              )}
            </div>
            {isGrouped && (
              <div className="flex gap-4 mb-6">
                <div className="w-2/5">
                  <h3 className="mb-2 font-semibold text-sm text-black">
                    {t('stone.stonesPerGroup')}
                  </h3>
                  <select
                    value={stonesPerGroup}
                    onChange={(e) => {
                      setStonesPerGroup(e.target.value);
                      // Add postMessage with ringKey
                      window.parent.postMessage(
                        { 
                          action: "stonesPerGroup", 
                          value: e.target.value,
                          ringKey: currentRingKey
                        },
                        "*"
                      );
                    }}
                    className="border border-[#e1e1e1] p-2 rounded w-full"
                  >
                    {StonesPerGroupOptions.map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
      
                <div className="w-3/5">
                  <h3 className="mb-2 font-semibold text-sm text-black">
                    {t('stone.divisionOfGroups')}
                  </h3>
                  <select
                    value={groupDivision}
                    onChange={(e) => {
                      setGroupDivision(e.target.value);
                      // Add postMessage with ringKey
                      window.parent.postMessage(
                        { 
                          action: "groupDivision", 
                          value: e.target.value,
                          ringKey: currentRingKey
                        },
                        "*"
                      );
                    }}
                    className="border border-[#e1e1e1] p-2 rounded w-full"
                  >
                    {DivisionGroupsOptions.map((num) => (
                      <option key={num} value={num}>
                        {t(`stone.distributions.${getDistributionKey(num)}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="mb-2 block font-semibold text-sm text-black">
                {t('stone.position')}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PositionTypeOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setStoneStyle(item.name);
                      console.log(`Clicked position ${item.name}, Ring: ${currentRingKey}`);
                      window.parent.postMessage(
                        { 
                          action: "stonePosition", 
                          value: item.name,
                          ringKey: currentRingKey
                        },
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
                      {getPositionTranslation(item.name)}
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
              {stoneStyle === "Free" && <StoneRangeSlider activeRing={activeRing} activeTab={activeTab} />}
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
        {stones.length > 1 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => removeStone(activeTab)}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <TrashSvg className={"text-inherit w-6"} />
            </div>
            {t('stone.removeStoneGroup')}
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