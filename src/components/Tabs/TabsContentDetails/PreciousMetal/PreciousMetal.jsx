import { useState } from "react";
import { PreciousMetalSelectBox } from "./PreciousMetalSelectBox";
import DistributionImg1 from "../../../../../public/profile/none.svg";
import DistributionImg2 from "../../../../../public/profile/two-color.svg";
import DistributionImg3 from "../../../../../public/profile/three-color.svg";
import { Dropdown } from "./Dropdown";

// import SelectField from "./shared/SelectField";

const metalOptions = [
  {
    value: "Gold",
    colorCode: "#FFD700", // Gold color
  },
  {
    value: "Silver",
    colorCode: "#C0C0C0", // Silver color
  },
  {
    value: "Platinum",
    colorCode: "#E5E4E2", // Platinum color
  },
  {
    value: "Apricot Gold",
    colorCode: "#D99058", // Approximate apricot color
  },
  {
    value: "Palladium",
    colorCode: "#CED0DD", // Palladium color
  },
  {
    value: "Rose Gold",
    colorCode: "#B76E79", // Rose Gold color
  },
  {
    value: "Red Gold",
    colorCode: "#C2412D", // Red Gold color
  },
  {
    value: "White Gold",
    colorCode: "#F5F5F5", // White Gold color
  },
  {
    value: "Yellow Gold",
    colorCode: "#FFD700", // Yellow Gold color (same as regular Gold)
  },
];

const surfaceOptions = [
  {
    value: "Vertical matt",
    colorCode: "#D3D3D3", // Matte color (Light Gray)
  },
  {
    value: "Polished",
    colorCode: "#FFFFFF", // Polished color (White)
  },
  {
    value: "Diagonal matt",
    colorCode: "#D3D3D3", // Matte color (Light Gray)
  },
  {
    value: "Ice matt",
    colorCode: "#B0C4DE", // Ice Matte color (Light Steel Blue)
  },
  {
    value: "Sand matt coarse",
    colorCode: "#C2B280", // Sand color
  },
  {
    value: "Sand matt fine",
    colorCode: "#F4A460", // Lighter sand color
  },
  {
    value: "Hammered polished",
    colorCode: "#E5E5E5", // Polished hammered look
  },
  {
    value: "Hammered sand matt",
    colorCode: "#C2B280", // Sand and hammered combination
  },
  {
    value: "Milled",
    colorCode: "#8B8589", // Milled color (Darker Gray)
  },
];

const DistributionOptions = [
  { name: "Single", img: DistributionImg1, disabled: false },
  { name: "Two tone", img: DistributionImg2, disabled: false },
  { name: "Tri Colored", img: DistributionImg3, disabled: true },
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
  const [purity, setPurity] = useState(9);
  const [partition, setPartition] = useState({
    name: "Single",
    img: DistributionImg1,
  });

  const [selectedMetalOption, setSelectedMetalOption] = useState({
    value: "Gold",
    colorCode: "#FFD700",
  });

  const [selectedSurfaceOption, setSelectedSurfaceOption] = useState({
    value: "Vertical matt",
    colorCode: "#D3D3D3",
  });

  // Separate isOpen states for different dropdowns
  const [isPartitionDropdownOpen, setIsPartitionDropdownOpen] = useState(false);
  const [isSurfaceDropdownOpen, setIsSurfaceDropdownOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const togglePartitionDropdown = (item) => {
    setPartition(item);
    setIsPartitionDropdownOpen(!isPartitionDropdownOpen);
  };

  const toggleSurfaceDropdown = () => {
    setIsSurfaceDropdownOpen(!isSurfaceDropdownOpen);
  };

  console.log("purity", purity);
  console.log("partition", partition);
  console.log("activeRing:", activeRing);

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto  mb-auto pt-5">
      {/* Partition Selection */}
      {Array.isArray(activeRing) &&
        activeRing[0].type === "Wedding" &&
        isExpert && (
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
                        src={item.img}
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
                  setSelectedOption={setSelectedOption}
                />
              )}
            </div>
          </>
        )}

      {/* Dropdowns for Metal and Surface */}
      <label className="block text-sm font-medium mt-4">
        Color and Surface
      </label>

      <PreciousMetalSelectBox
        options={metalOptions}
        setSelectedOption={setSelectedMetalOption}
        selectedOption={selectedMetalOption}
      />

      <PreciousMetalSelectBox
        options={surfaceOptions}
        selectedOption={selectedSurfaceOption}
        setSelectedOption={setSelectedSurfaceOption}
      />

     

      {/* Purity Selection */}
      <div className="py-1">
        <span className="text-sm font-semibold">
          Cleanliness - {selectedMetalOption.value}
        </span>
      </div>

      <div className="flex space-x-1 mb-5">
        {purityOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => setPurity(item)}
            className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
              purity === item ? "border border-[#205fa8]" : "bg-white"
            }`}
          >
            {item} kt
          </button>
        ))}
      </div>

       {/* Surface Dropdown */}
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
    </div>
  );
};
