import { useState } from "react";
import { PreciousMetalSelectBox } from "./PreciousMetalSelectBox";
import DistributionImg1 from "../../../../../public/profile/none.svg";
import DistributionImg2 from "../../../../../public/profile/two-color.svg";
import DistributionImg3 from "../../../../../public/profile/three-color.svg";
import { Dropdown } from "./Dropdown";

const metalOptions = [
  {
    value: "Gold",
    colorCode: "#FFD700",
  },
  {
    value: "Silver",
    colorCode: "#C0C0C0",
  },
  {
    value: "Platinum",
    colorCode: "#E5E4E2",
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
  },
  {
    value: "White Gold",
    colorCode: "#F5F5F5",
  },
  {
    value: "Yellow Gold",
    colorCode: "#FFD700",
  },
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
  isPair,
  toggleIsPair,
  isExpert,
  activeRing,
}) => {
  const isWeddingRing = Array.isArray(activeRing)
    ? activeRing[0]?.type === "Wedding"
    : activeRing?.type === "Wedding";

  const [selections, setSelections] = useState({
    single: {
      metal: { value: "Gold", colorCode: "#FFD700" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
    twoTone: {
      metal: { value: "Gold", colorCode: "#FFD700" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
    triColored: {
      metal: { value: "Gold", colorCode: "#FFD700" },
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
  const handleOptionSelect = (option) => {
    if (option.name === "Two tone") {
      setSelectedPartitionTwotoneImg(option);
    } else {
      setSelectedPartitionTriColoredImg(option);
    }
    setSelectedOption(option);
    setIsPartitionDropdownOpen(false);
  };

  // console.log("purity", purity);
  // console.log("partition", partition);
  // console.log("activeRing:", activeRing);
  console.log("selectedOption", selectedOption);
  console.log("selectedPartitionImg", selectedPartitionTwotoneImg);

  return (
    <div className=" mb-auto ">
      {isWeddingRing && isExpert && (
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
                      {/* Show updated image if dropdown option is selected */}
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
                  setSelectedOption={handleOptionSelect} // Updated handle function
                />
              )}
            </div>
          </>
        )}

        {/* Dropdowns for Metal and Surface */}
        <label className="block text-sm font-medium mt-4">
          Color and Surface
        </label>
        <div className="flex gap-3">
          {/* Single Partition */}
          <div className="flex-1">
            <PreciousMetalSelectBox
              options={metalOptions}
              setSelectedOption={(value) =>
                updateSelection("single", "metal", value)
              }
              selectedOption={selections.single.metal}
            />
            {isWeddingRing && isExpert && (
              <PreciousMetalSelectBox
                options={surfaceOptions}
                selectedOption={selections.single.surface}
                setSelectedOption={(value) =>
                  updateSelection("single", "surface", value)
                }
              />
            )}
            {/* Purity Selection */}
            <div className="py-1">
              <span className="text-sm font-semibold">
                Cleanliness - {selections.single.metal.value}
              </span>
            </div>
            <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
              {purityOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => updateSelection("single", "purity", item)}
                  className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                    selections.single.purity === item
                      ? "border border-[#205fa8]"
                      : "bg-white"
                  }`}
                >
                  {item} kt
                </button>
              ))}
            </div>
          </div>

          {/* Two Tone Partition */}
          {selectedPartitionTwotoneImg && (
            <div className="flex-1">
              <PreciousMetalSelectBox
                options={metalOptions}
                setSelectedOption={(value) =>
                  updateSelection("twoTone", "metal", value)
                }
                selectedOption={selections.twoTone.metal}
              />
              {isWeddingRing && isExpert && (
                <PreciousMetalSelectBox
                  options={surfaceOptions}
                  selectedOption={selections.twoTone.surface}
                  setSelectedOption={(value) =>
                    updateSelection("twoTone", "surface", value)
                  }
                />
              )}
              {/* Purity Selection */}
              <div className="py-1">
                <span className="text-sm font-semibold">
                  Cleanliness - {selections.twoTone.metal.value}
                </span>
              </div>
              <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
                {purityOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => updateSelection("twoTone", "purity", item)}
                    className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                      selections.twoTone.purity === item
                        ? "border border-[#205fa8]"
                        : "bg-white"
                    }`}
                  >
                    {item} kt
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tri Colored Partition */}
          {selectedPartitionTriColoredImg && (
            <div className="flex-1">
              <PreciousMetalSelectBox
                options={metalOptions}
                setSelectedOption={(value) =>
                  updateSelection("triColored", "metal", value)
                }
                selectedOption={selections.triColored.metal}
              />
              {isWeddingRing && isExpert && (
                <PreciousMetalSelectBox
                  options={surfaceOptions}
                  selectedOption={selections.triColored.surface}
                  setSelectedOption={(value) =>
                    updateSelection("triColored", "surface", value)
                  }
                />
              )}
              {/* Purity Selection */}
              <div className="py-1">
                <span className="text-sm font-semibold">
                  Cleanliness - {selections.triColored.metal.value}
                </span>
              </div>
              <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
                {purityOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      updateSelection("triColored", "purity", item)
                    }
                    className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                      selections.triColored.purity === item
                        ? "border border-[#205fa8]"
                        : "bg-white"
                    }`}
                  >
                    {item} kt
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
};