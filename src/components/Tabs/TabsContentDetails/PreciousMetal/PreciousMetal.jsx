import { useState, useEffect, useRef } from "react";
import DistributionImg1 from "../../../../../public/profile/none.svg";
import DistributionImg2 from "../../../../../public/profile/two-color.svg";
import DistributionImg3 from "../../../../../public/profile/three-color.svg";
import { Dropdown } from "./Dropdown";
import { RangeSlider } from "../../../shared/RangeSlider";
// import { MultiRangeSlider } from "../../../shared/MultiRangeSlider";
import MultiRangeMaskSlider0 from "../../../shared/SimpleCRangeSlider0";
import MultiRangeMaskSlider from "../../../shared/SimpleCRangeSlider";
import MultiRangeMaskSlider2 from "../../../shared/SimpleCRangeSlider2";
import { ColorSurface } from "./ColorSurface";
import IsPair from "../../../shared/IsPair";
import { useLocalization } from "../../../../context/LocalizationContext";

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
  const { t } = useLocalization();

  // Function to get ring-specific localStorage key
  const getRingKey = (key) => {
    if (Array.isArray(activeRing)) {
      return `${key}_${activeRing.map(ring => ring.name).join('_')}`;
    }
    return `${key}_${activeRing?.name || 'default'}`;
  };

  // Function to save settings for paired rings
  const savePairedSettings = (key, value) => {
    if (isPair && isPair.pair1 && Array.isArray(rings) && rings.length >= 2) {
      // Save for all pair rings
      const ring1Key = `${key}_${rings[0]?.name || 'ring1'}`;
      const ring2Key = `${key}_${rings[1]?.name || 'ring2'}`;
      
      localStorage.setItem(ring1Key, value);
      localStorage.setItem(ring2Key, value);
      
      // If we have a second pair
      if (isPair.pair2 && rings.length >= 4) {
        const ring3Key = `${key}_${rings[2]?.name || 'ring3'}`;
        const ring4Key = `${key}_${rings[3]?.name || 'ring4'}`;
        
        localStorage.setItem(ring3Key, value);
        localStorage.setItem(ring4Key, value);
      }
    } else {
      // Just save for the active ring
      localStorage.setItem(getRingKey(key), value);
    }
  };

  const getTwoToneOptions = () => {
    return options.map((option) => {
      // Add opacity 0.3 for specific patterns
      if (["Golf vrij"].includes(option.label.trim())) {
        return { ...option, opacity: 0.3 };
      }
      return option;
    });
  };

  const getTriColorOptions = () => {
    return options2.map((option) => {
      // Add opacity 0.3 for specific patterns
      if (
        [
          "4:1:1",
          "Golf 2:1:2",
          "Diagonaal 2:1:2",
          "Golf Vrij",
          "Diagonaal vrij",
        ].includes(option.label.trim())
      ) {
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
      metal1: { value: "Gold", colorCode: "#D8BC7E" },
      surface1: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity1: null,
      metal2: { value: "Silver", colorCode: "#E3E3E2" },
      surface2: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity2: null,
      metal3: { value: "Palladium", colorCode: "#CED0DD" },
      surface3: { value: "Vertical matt", colorCode: "#D3D3D3" },
      purity3: null,
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
    console.log("Toggling partition dropdown:", item);
    
    // If we're selecting a new partition type, reset the old one
    if (partition.name !== item.name) {
      // Reset the appropriate image state
      if (item.name === "Two tone") {
        setSelectedPartitionTriColoredImg(null);
        savePairedSettings("selectedPartitionTriColoredImg", JSON.stringify(null));
      } else if (item.name === "Tri Colored") {
        setSelectedPartitionTwotoneImg(null);
        savePairedSettings("selectedPartitionTwotoneImg", JSON.stringify(null));
      }
    }
    
    // Update the partition state
    setPartition(item);
    savePairedSettings("partition", JSON.stringify(item));
    
    // Toggle the dropdown
    setIsPartitionDropdownOpen(!isPartitionDropdownOpen);
  };

  const toggleSurfaceDropdown = () => {
    setIsSurfaceDropdownOpen(!isSurfaceDropdownOpen);
  };

  const updateSelection = (partition, field, value) => {
    // Get the ring identifier for the message
    const ringIdentifier = Array.isArray(activeRing) 
      ? activeRing.map(ring => ring.name).join('_')
      : activeRing?.name || 'default';
    
    // Determine actual partition and field for triColored sections
    let actualPartition = partition;
    let actualField = field;
    
    // For triColored1, triColored2, triColored3, map to the triColored object with specific fields
    if (partition.startsWith('triColored')) {
      const position = partition.charAt(partition.length - 1);
      actualPartition = 'triColored';
      actualField = `${field}${position}`;
    }
    
    // Restore automatic message sending for user interaction
    window.parent.postMessage(
      {
        action: "changeColor",
        value,
        isBiCol: selectedPartitionTwotoneImg,
        isTriCol: selectedPartitionTriColoredImg,
        field: partition,
        position: partition.startsWith('triColored') ? partition.charAt(partition.length - 1) : null,
        ringIdentifier: ringIdentifier,
        isPair: isPair && isPair.pair1
      },
      "*"
    );
    
    setSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      
      // If it's a triColored section (1, 2, or 3), update the specific field
      if (partition.startsWith('triColored')) {
        updatedSelections.triColored = {
          ...updatedSelections.triColored,
          [actualField]: value,
        };
      } else {
        // Otherwise, just update the normal partition and field
        updatedSelections[partition] = {
          ...updatedSelections[partition],
          [field]: value,
        };
      }
    
      // Save settings - either for current ring or for all rings if isPair is true
      const selectionsStr = JSON.stringify(updatedSelections);
      savePairedSettings("selections", selectionsStr);
      
      return updatedSelections;
    });
  };

  // Function to handle selection from the dropdown
  const handleOptionSelect = (option) => {
    let isTwoTone = null;
    const ringIdentifier = Array.isArray(activeRing) 
      ? activeRing.map(ring => ring.name).join('_')
      : activeRing?.name || 'default';
    
    if (option.name === "Two tone") {
      setSelectedPartitionTwotoneImg(option);
      savePairedSettings("selectedPartitionTwotoneImg", JSON.stringify(option));
      
      setSelectedPartitionTriColoredImg(null);
      savePairedSettings("selectedPartitionTriColoredImg", JSON.stringify(null));
      
      isTwoTone = true;
    } else {
      setSelectedPartitionTriColoredImg(option);
      savePairedSettings("selectedPartitionTriColoredImg", JSON.stringify(option));
      
      setSelectedPartitionTwotoneImg(null);
      savePairedSettings("selectedPartitionTwotoneImg", JSON.stringify(null));
      
      isTwoTone = false;
      
      // Initialize tri-colored selections with defaults if not already set
      setSelections(prev => {
        // Only update if the tri-colored specific fields aren't already set
        if (!prev.triColored.metal1 || !prev.triColored.metal2 || !prev.triColored.metal3) {
          const updatedSelections = {
            ...prev,
            triColored: {
              ...prev.triColored,
              metal1: prev.triColored.metal1 || { value: "Gold", colorCode: "#D8BC7E" },
              surface1: prev.triColored.surface1 || { value: "Vertical matt", colorCode: "#D3D3D3" },
              purity1: prev.triColored.purity1 || null,
              metal2: prev.triColored.metal2 || { value: "Silver", colorCode: "#E3E3E2" },
              surface2: prev.triColored.surface2 || { value: "Vertical matt", colorCode: "#D3D3D3" },
              purity2: prev.triColored.purity2 || null,
              metal3: prev.triColored.metal3 || { value: "Palladium", colorCode: "#CED0DD" },
              surface3: prev.triColored.surface3 || { value: "Vertical matt", colorCode: "#D3D3D3" },
              purity3: prev.triColored.purity3 || null,
            }
          };
          
          // Save updated selections for all rings if isPair is true
          savePairedSettings("selections", JSON.stringify(updatedSelections));
          
          return updatedSelections;
        }
        return prev;
      });
    }
    
    setSelectedOption(option);
    setIsPartitionDropdownOpen(false);
    
    // Restore sending message for user-initiated changes
    window.parent.postMessage(
      { 
        action: "PreciousMetal", 
        value: option.label, 
        isBiCol: isTwoTone,
        ringIdentifier: ringIdentifier,
        isPair: isPair && isPair.pair1
      },
      "*"
    );
    
    // Log the selection to the console
    console.log(`Option selected: ${option.label}, Value: ${option.img}`);
  };

  useEffect(() => {
    // Load ring-specific data from localStorage
    const savedPartition = localStorage.getItem(getRingKey("partition"));
    const savedSelections = localStorage.getItem(getRingKey("selections"));
    const savedTwoToneImg = localStorage.getItem(getRingKey("selectedPartitionTwotoneImg"));
    const savedTriColorImg = localStorage.getItem(getRingKey("selectedPartitionTriColoredImg"));

    console.log("Loading state for ring:", activeRing?.name || 'default', 
                "savedPartition:", savedPartition ? JSON.parse(savedPartition).name : 'none',
                "hasTwoTone:", !!savedTwoToneImg, 
                "hasTriColor:", !!savedTriColorImg,
                "isPair:", isPair ? `pair1: ${isPair.pair1}, pair2: ${isPair.pair2}` : 'false');

    // Reset to default state first to avoid stale UI
    setSelectedPartitionTwotoneImg(null);
    setSelectedPartitionTriColoredImg(null);
    setPartition({
      name: "Single",
      img: DistributionImg1,
    });

    // Apply saved data if available
    if (savedPartition) {
      const parsedPartition = JSON.parse(savedPartition);
      setPartition(parsedPartition);
      
      // Make sure two-tone and tri-colored are properly set based on partition
      if (parsedPartition.name === "Two tone" && savedTwoToneImg) {
        setSelectedPartitionTwotoneImg(JSON.parse(savedTwoToneImg));
      } else if (parsedPartition.name === "Tri Colored" && savedTriColorImg) {
        setSelectedPartitionTriColoredImg(JSON.parse(savedTriColorImg));
      }
    }
    
    if (savedSelections) {
      setSelections(JSON.parse(savedSelections));
    }
    
    // If no saved data for this ring, reset to defaults
    if (!savedPartition && !savedSelections) {
      setSelections({
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
          // Legacy format - keep for backward compatibility
          metal: { value: "Silver", colorCode: "#E3E3E2" },
          surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity: null,
          // New format with specific positions
          metal1: { value: "Gold", colorCode: "#D8BC7E" },
          surface1: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity1: null,
          metal2: { value: "Silver", colorCode: "#E3E3E2" },
          surface2: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity2: null,
          metal3: { value: "Palladium", colorCode: "#CED0DD" },
          surface3: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity3: null,
        },
      });
    }

    // NOTE: Removed automatic message sending to avoid applying changes to 3D app
    // when switching between rings. Changes will only be applied when the user 
    // explicitly interacts with the UI.
  }, [activeRing, isPair]); // Re-run when activeRing or isPair changes

  useEffect(() => {
    // If this is a new state (no saved data), initialize with proper structure for tri-colored
    if (!localStorage.getItem(getRingKey("selections"))) {
      setSelections({
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
          // Legacy format - keep for backward compatibility
          metal: { value: "Silver", colorCode: "#E3E3E2" },
          surface: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity: null,
          // New format with specific positions
          metal1: { value: "Gold", colorCode: "#D8BC7E" },
          surface1: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity1: null,
          metal2: { value: "Silver", colorCode: "#E3E3E2" },
          surface2: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity2: null,
          metal3: { value: "Palladium", colorCode: "#CED0DD" },
          surface3: { value: "Vertical matt", colorCode: "#D3D3D3" },
          purity3: null,
        },
      });
    }
  }, []);

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
            <label className="block text-sm font-medium mb-2">{t('preciousMetal.partition')}</label>
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
                              savePairedSettings("partition", JSON.stringify(item));
                              setIsPartitionDropdownOpen(false);
                              setSelectedPartitionTwotoneImg(null);
                              setSelectedPartitionTriColoredImg(null);
                              
                              // Clear from localStorage too when switching to single
                              savePairedSettings("selectedPartitionTwotoneImg", JSON.stringify(null));
                              savePairedSettings("selectedPartitionTriColoredImg", JSON.stringify(null));
                              
                              // Restore message sending for user-initiated changes
                              const ringIdentifier = Array.isArray(activeRing) 
                                ? activeRing.map(ring => ring.name).join('_')
                                : activeRing?.name || 'default';
                                
                              window.parent.postMessage(
                                { 
                                  action: "PreciousMetal", 
                                  value: 0,
                                  ringIdentifier: ringIdentifier,
                                  isPair: isPair && isPair.pair1
                                },
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
                      <span>{item.name === "Single" ? t('preciousMetal.singleColor') : 
                             item.name === "Two tone" ? t('preciousMetal.twoTone') : 
                             t('preciousMetal.triColored')}</span>
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
                  options={
                    partition.name === "Two tone"
                      ? getTwoToneOptions()
                      : getTriColorOptions()
                  }
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
            updateSelection(partition, field, value);
          }}
          surfaceOptions={surfaceOptions}
          purityOptions={purityOptions}
          selections={selections}
          selectedPartitionTwotoneImg={selectedPartitionTwotoneImg}
          selectedPartitionTriColoredImg={selectedPartitionTriColoredImg}
          activeRing={activeRing}
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
              <button>{t('preciousMetal.chooseDifferentSurface')}</button>
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
        {isWeddingRing &&
          selectedPartitionTwotoneImg &&
          !selectedPartitionTriColoredImg &&
          window.ringsLength == 1 && (
            <RangeSlider
              title={"Ring"}
              min={-0.159}
              max={0.159}
              step={0.001}
              defaultValue={0}
            />
          )}
        {isWeddingRing &&
          selectedPartitionTwotoneImg &&
          !selectedPartitionTriColoredImg &&
          window.ringsLength == 2 && (
            <RangeSlider
              title={"Ring 1"}
              min={-0.85}
              max={-0.55}
              step={0.001}
              defaultValue={-0.7}
            />
          )}
        {isWeddingRing &&
          selectedPartitionTwotoneImg &&
          !selectedPartitionTriColoredImg &&
          window.ringsLength == 2 && (
            <RangeSlider
              title={"Ring 2"}
              min={0.55}
              max={0.85}
              step={0.001}
              defaultValue={0.7}
            />
          )}
        {isWeddingRing &&
          selectedPartitionTriColoredImg &&
          window.ringsLength == 1 && <MultiRangeMaskSlider0 />}
        {isWeddingRing &&
          selectedPartitionTriColoredImg &&
          window.ringsLength == 2 && <MultiRangeMaskSlider />}
        {isWeddingRing &&
          selectedPartitionTriColoredImg &&
          window.ringsLength == 2 && <MultiRangeMaskSlider2 />}
      </div>
    </div>
  );
};
