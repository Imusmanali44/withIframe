import { useState } from "react";
import DistributionImg1 from "../../../../../public/profile/none.svg";
import DistributionImg2 from "../../../../../public/profile/two-color.svg";
import DistributionImg3 from "../../../../../public/profile/three-color.svg";
import { Dropdown } from "./Dropdown";
import { RangeSlider } from "../../../shared/RangeSlider";
import { ColorSurface } from "./ColorSurface";
import IsPair from "../../../shared/IsPair";

const metalOptions = [
  {
    value: "Gold",
    colorCode: "#DAB04A",
  },
  {
    value: "Silver",
    colorCode: "#A09F9D",
  },
  {
    value: "Platinum",
    colorCode: "#BFBFBF",
  },
  {
    value: "Apricot Gold",
    colorCode: "#D99058",
  },
  {
    value: "Palladium",
    colorCode: "#CED0DD",
  },
  {
    value: "Rose Gold",
    colorCode: "#B76E79",
  },
  {
    value: "Red Gold",
    colorCode: "#C2412D",
  }
];

const surfaceOptions = [
  {
    value: "Vertical matt",
    colorCode: "#D3D3D3",
  },
  {
    value: "Polished",
    colorCode: "#FFFFFF",
  },
  {
    value: "Diagonal matt",
    colorCode: "#D3D3D3",
  },
  {
    value: "Ice matt",
    colorCode: "#B0C4DE",
  },
  {
    value: "Sand matt coarse",
    colorCode: "#C2B280",
  },
  {
    value: "Sand matt fine",
    colorCode: "#F4A460",
  },
  {
    value: "Hammered polished",
    colorCode: "#E5E5E5",
  },
  {
    value: "Hammered sand matt",
    colorCode: "#C2B280",
  },
  {
    value: "Milled",
    colorCode: "#8B8589",
  },
];

const DistributionOptions = [
  { name: "Single", img: DistributionImg1, disabled: false },
  { name: "Two tone", img: DistributionImg2, disabled: false },
  { name: "Tri Colored", img: DistributionImg3, disabled: false },
];

const purityOptions = [8, 9, 14, 18];

const options = [
  {
    label: "1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-1.svg",
  },
  {
    label: "1:2",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-2.svg",
  },
  {
    label: "1:3",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-3.svg",
  },
  {
    label: "Golf 1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-1-1.svg",
  },
  {
    label: "Golf 1:2",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-1.svg",
  },
  {
    label: "Golf 1:3",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-2.svg",
  },
  {
    label: "Golf 1:4",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-3.svg",
  },
  {
    label: "Golf 1:5",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-1-1.svg",
  },
];

export const PreciousMetal = ({
  rings,
  isPair,
  setIsPair,
  isExpert,
  activeRing,
}) => {
  const isWeddingRing = Array.isArray(activeRing)
    ? activeRing[0]?.type === "Wedding"
    : activeRing?.type === "Wedding";

  const [selections, setSelections] = useState({
    single: {
      metal: { value: "Silver", colorCode: "#BFBFBF" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
    twoTone: {
      metal: { value: "Silver", colorCode: "#FFD700" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
    triColored: {
      metal: { value: "Silver", colorCode: "#FFD700" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
  });

  const [partition, setPartition] = useState({
    name: "Single",
    img: DistributionImg1,
  });

  const [selectedSurfaceOption, setSelectedSurfaceOption] = useState({
    value: "Vertical matt",
    colorCode: "#D3D3D3",
  });

  const [isPartitionDropdownOpen, setIsPartitionDropdownOpen] = useState(false);
  const [isSurfaceDropdownOpen, setIsSurfaceDropdownOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedPartitionTwotoneImg, setSelectedPartitionTwotoneImg] =
    useState(null);
  const [selectedPartitionTriColoredImg, setSelectedPartitionTriColoredImg] =
    useState(null);

  const togglePartitionDropdown = (item) => {
    setPartition(item);
    setIsPartitionDropdownOpen(!isPartitionDropdownOpen);
  };

  const toggleSurfaceDropdown = () => {
    setIsSurfaceDropdownOpen(!isSurfaceDropdownOpen);
  };

  const updateSelection = (partition, field, value) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [partition]: {
        ...prevSelections[partition],
        [field]: value,
      },
    }));
  };

  // Function to handle selection from the dropdown
// Function to handle selection from the dropdown
const handleOptionSelect = (option) => {
  if (option.name === "Two tone") {
    setSelectedPartitionTwotoneImg(option);
  } else {
    setSelectedPartitionTriColoredImg(option);
  }
  setSelectedOption(option);
  setIsPartitionDropdownOpen(false);

  // Log the selection to the console
  console.log(`Option selected: ${option.label}, Value: ${option.img}`);
};


  // console.log("purity", purity);
  // console.log("partition", partition);
  // console.log("activeRing:", activeRing);
  // console.log("selectedOption", selectedOption);
  console.log("selectedPartitionImg", selectedPartitionTwotoneImg);

  return (
    <div className="mb-auto">
      {rings &&
        (rings[0]?.type === rings[1]?.type ||
          rings[2]?.type === rings[3]?.type) && (
          <IsPair
            activeRing={activeRing}
            isPair={isPair}
            setIsPair={setIsPair}
          />
        )}
      <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
        {/* Partition Selection */}
        {isWeddingRing && isExpert && (
          <>
            <label className="block text-sm font-medium mb-2">Partition</label>
            <div className="relative">
              <div className="flex space-x-2 mb-6">
                {DistributionOptions.map((item, index) => (
                  <div key={index} className="w-1/3">
                    <button
                      onClick={
                        index !== 0
                          ? () => togglePartitionDropdown(item)
                          : () => {
                              setPartition(item);
                              setIsPartitionDropdownOpen(false);
                              setSelectedPartitionTwotoneImg(null);
                              setSelectedPartitionTriColoredImg(null);
                            }
                      }
                      className={`bg-white w-full border ${
                        item.disabled && "opacity-30"
                      } ${
                        partition.name === item.name
                          ? "border-[#205fa8]"
                          : "border-[#e1e1e1]"
                      }`}
                      disabled={item.disabled}
                    >
                      <span>{item.name}</span>
                      <img
                        src={
                          item.name === "Two tone" &&
                          selectedPartitionTwotoneImg
                            ? selectedPartitionTwotoneImg.img
                            : item.name === "Tri Colored" &&
                              selectedPartitionTriColoredImg
                            ? selectedPartitionTriColoredImg.img
                            : item.img
                        }
                        className="mx-auto mt-5"
                        alt={item.name}
                      />
                    </button>
                  </div>
                ))}
              </div>
              {isPartitionDropdownOpen && (
                <Dropdown
                  title={partition.name}
                  options={options}
                  setIsOpen={setIsPartitionDropdownOpen}
                  selectedOption={selectedOption}
                  setSelectedOption={handleOptionSelect}
                  
                />
              )}
            </div>
          </>
        )}
        {/* Dropdowns for Metal and Surface */}

        <ColorSurface
  isWeddingRing={isWeddingRing}
  isExpert={isExpert}
  metalOptions={metalOptions}
  updateSelection={(partition, field, value) => {
    console.log("Updated selection in ColorSurface:", {
      partition,
      field,
      value,
    });
    window.parent.postMessage({ action: "changeColor", value }, "*"); // Send message to Configurator

    updateSelection(partition, field, value);
  }}
  surfaceOptions={surfaceOptions}
  purityOptions={purityOptions}
  selections={selections}
  selectedPartitionTwotoneImg={selectedPartitionTwotoneImg}
  selectedPartitionTriColoredImg={selectedPartitionTriColoredImg}
/>

        {/* Surface Dropdown */}
        {isWeddingRing &&
          isExpert &&
          !selectedPartitionTwotoneImg &&
          !selectedPartitionTriColoredImg && (
            <div
              className="mt-4 relative px-3 py-2 bg-white border"
              onClick={toggleSurfaceDropdown}
            >
              <button>Choose different surface</button>
              {isSurfaceDropdownOpen && (
                <Dropdown
                  title="Surface Options"
                  options={options}
                  setIsOpen={setIsSurfaceDropdownOpen}
                  selectedOption={selectedSurfaceOption}
                  setSelectedOption={setSelectedSurfaceOption}
                />
              )}
            </div>
          )}
        {isWeddingRing && selectedPartitionTwotoneImg && (
          <RangeSlider
            title={"Selected Value"}
            min={10}
            max={200}
            step={5}
            defaultValue={75}
          />
        )}
      </div>
    </div>
  );
};
