import { useState,useEffect } from "react";
import DistributionImg1 from "../../../../../public/profile/none.svg";
import DistributionImg2 from "../../../../../public/profile/two-color.svg";
import DistributionImg3 from "../../../../../public/profile/three-color.svg";
import { Dropdown } from "./Dropdown";
import { RangeSlider } from "../../../shared/RangeSlider";
// import { MultiRangeSlider } from "../../../shared/MultiRangeSlider";
import MultiRangeMaskSlider0 from "../../../shared/SimpleCRangeSlider0";
import  MultiRangeMaskSlider  from "../../../shared/SimpleCRangeSlider"
import MultiRangeMaskSlider2 from "../../../shared/SimpleCRangeSlider2";
import { ColorSurface } from "./ColorSurface";
import IsPair from "../../../shared/IsPair";

const metalOptions = [
  {
    value: "Gold",
    colorCode: "#D8BC7E",
  },
  {
    value: "Silver",
    colorCode: "#E3E3E2",
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
  // {
  //   value: "Red Gold",
  //   colorCode: "#C2412D",
  // }
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
    // opacity: 0.3, // Added opacity
  },
  {
    label: "1:4",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-4.svg",
    // opacity: 0.3, // Added opacity
  },
  {
    label: "Golf 1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-1-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: "Diagonaal 1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/diagonal-1-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: "Segment 1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/segment-1-1.svg",
    // opacity: 0.3, // Added opacity
  },
  {
    label: "Axiaal 1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/horizontal-1-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: " Vrij ",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-free-2.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: " Golf vrij ",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-free-2.svg",
    opacity: 0.3, // Added opacity
  },
  {
    label: " Diagonaal vrij ",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/diagonal-free-2.svg",
    opacity: 0.3, // Added opacity

  },
];

const options2 = [
  {
    label: " 1:1:1 ",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-1-1.svg",
  },
  {
    label: "1:2:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-2-1.svg",
  },
  {
    label: "1:3:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-3-1.svg",
    // opacity: 0.3, // Added opacity
  },
  {
    label: "1:4:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-1-4-1.svg",
    // opacity: 0.3, // Added opacity
  },
  {
    label: "2:1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-2-1-1.svg",
  },
  {
    label: "3:1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-3-1-1.svg",
    // opacity: 0.3, // Added opacity
  },
  {
    label: "4:1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/horizontal-1-1.svg",
    opacity: 0.3, // Added opacity
  },
  {
    label: "2:1:2",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-2-1-2.svg",
  },
  {
    label: "Golf 1:1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-1-1-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: "Golf 1:2:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-1-2-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: "Golf 2:1:2",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-2-1-2.svg",
    opacity: 0.3, // Added opacity
  },
  {
    label: "Diagonaal 1:1:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/diagonal-1-1-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: "Diagonaal 1:2:1",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/diagonal-1-2-1.svg",
    opacity: 0.3, // Added opacity

  },
  {
    label: "Diagonaal 2:1:2",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-2-1-2.svg",
    opacity: 0.3, // Added opacity
  },
  {
    label: "Vrij",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/vertical-free-3.svg",
    opacity: 0.3,

  },
  {
    label: "Golf Vrij",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/wave-free-3.svg",
    opacity: 0.3,
  },
  {
    label: "Diagonaal vrij",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/division/proto/simple/diagonal-free-3.svg",
    opacity: 0.3, // Added opacity
  },
];

export const PreciousMetal = ({
  rings,
  isPair,
  setIsPair,
  isExpert,
  activeRing,
}) => {
  useEffect(() => {
    // Reset partition to Single whenever rings array changes
    setPartition({
      name: "Single",
      img: DistributionImg1
    });
    // Reset selected partition images
    setSelectedPartitionTwotoneImg(null);
    setSelectedPartitionTriColoredImg(null);
    // Notify parent about the reset
    // window.parent.postMessage(
    //   { action: "PreciousMetal", value: 0 },
    //   "*"
    // );
  }, [rings?.length]);
  const getTwoToneOptions = () => {
    return options.map(option => {
      // Add opacity 0.3 for specific patterns
      if ([ "Golf vrij"].includes(option.label.trim())) {
        return { ...option, opacity: 0.3 };
      }
      return option;
    });
  };

  const getTriColorOptions = () => {
    return options2.map(option => {
      // Add opacity 0.3 for specific patterns
      if ([
        "4:1:1",
        "Golf 2:1:2",
        "Diagonaal 2:1:2",
        "Golf Vrij",
        "Diagonaal vrij"
      ].includes(option.label.trim())) {
        return { ...option, opacity: 0.3 };
      }
      return option;
    });
  };


  const isWeddingRing = Array.isArray(activeRing)
    ? activeRing[0]?.type === "Wedding"
    : activeRing?.type === "Wedding";

  const [selections, setSelections] = useState({
    single: {
      metal: { value: "Silver", colorCode: "#E3E3E2" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
    twoTone: {
      metal: { value: "Gold", colorCode: "#D8BC7E" },
      surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity: null,
    },
    triColored: {
      metal: { value: "Silver", colorCode: "#E3E3E2" },
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
    console.log(item)
    setPartition(item);
    setIsPartitionDropdownOpen(!isPartitionDropdownOpen);
  };

  const toggleSurfaceDropdown = () => {
    setIsSurfaceDropdownOpen(!isSurfaceDropdownOpen);
  };

  const updateSelection = (partition, field, value) => {
    // Always send the message, regardless of whether the state changes
    window.parent.postMessage(
      {
        action: "changeColor",
        value,
        isBiCol: selectedPartitionTwotoneImg,
        isTriCol: selectedPartitionTriColoredImg,
        field: partition,
      },
      "*"
    );
  
    // Update state after sending the message
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
    let isTwoTone = null;
    if (option.name === "Two tone") {
      setSelectedPartitionTwotoneImg(option);
      setSelectedPartitionTriColoredImg(null);
      isTwoTone = true;
    } else {
      setSelectedPartitionTriColoredImg(option);
      setSelectedPartitionTwotoneImg(option);

      isTwoTone = false;
    }
    setSelectedOption(option);
    setIsPartitionDropdownOpen(false);

    // Log the selection to the console
    console.log(`Option selected: ${option.label}, Value: ${option.img}`);
    window.parent.postMessage(
      { action: "PreciousMetal", value: option.label, isBiCol: isTwoTone },
      "*"
    );
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
                              console.log(index, DistributionOptions)
                              window.parent.postMessage(
                                { action: "PreciousMetal", value: index },
                                "*"
                              );
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
          options={partition.name === "Two tone" ? getTwoToneOptions() : getTriColorOptions()}
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
            // console.log("Updated selection in ColorSurface:", {
            //   partition,
            //   field,
            //   value,
            //   selectedPartitionTwotoneImg,
            //   selectedPartitionTriColoredImg,
            // });
            // window.parent.postMessage(
            //   {
            //     action: "changeColor",
            //     value,
            //     isBiCol: selectedPartitionTwotoneImg,
            //     isTriCol: selectedPartitionTriColoredImg,
            //     field: partition,
            //   },
            //   "*"
            // ); // Send message to Configurator

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
           {isWeddingRing && selectedPartitionTwotoneImg && !selectedPartitionTriColoredImg &&  (window.ringsLength==1) &&(
          <RangeSlider
            title={"Ring"}
            min={-0.159}
            max={0.159}
            step={0.001}
            defaultValue={0}
          />
        )}
        {isWeddingRing && selectedPartitionTwotoneImg && !selectedPartitionTriColoredImg && (window.ringsLength==2)  && (
          <RangeSlider
            title={"Ring 1"}
            min={-0.85}
            max={-0.55}
            step={0.001}
            defaultValue={-0.7}
          />
        )}
         {isWeddingRing && selectedPartitionTwotoneImg && !selectedPartitionTriColoredImg && (window.ringsLength==2)  &&(
          <RangeSlider
            title={"Ring 2"}
            min={0.55}
            max={0.85}
            step={0.001}
            defaultValue={0.7}
          />
        )}
        {/* {isWeddingRing && selectedPartitionTriColoredImg && (
        <MultiRangeSlider />
        )} */}
          {isWeddingRing && selectedPartitionTriColoredImg && (window.ringsLength==1)  &&(
       <MultiRangeMaskSlider0 
    
     />
        )}
        {isWeddingRing && selectedPartitionTriColoredImg &&  (window.ringsLength==2)  &&(
       <MultiRangeMaskSlider 
    
     />
        )}
            {isWeddingRing && selectedPartitionTriColoredImg && (window.ringsLength==2)  &&(
       <MultiRangeMaskSlider2 
    
     />
        )}
      </div>
    </div>
  );
};
