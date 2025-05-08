import { useEffect } from "react";
import { SelectField } from "../../../shared/SelectField";

const widthOption = [
  { name: "0.20 mm", value: "0.20" },
  { name: "0.30 mm", value: "0.30" },
  { name: "0.40 mm", value: "0.40" },
  { name: "0.50 mm", value: "0.50" },
  // { name: "0.60 mm", value: "0.60" },
];

const depthOption = [
  { name: "0.05 mm", value: "0.20" },
  { name: "0.10 mm", value: "0.30" },
  { name: "0.15 mm", value: "0.40" },
  // { name: "0.25 mm", value: "0.50" },
  // { name: "0.30 mm", value: "0.60" },
];

const surfaceOption = [
  { name: "Polished", value: "polished" },
  { name: "Sand mat fine", value: "sand_mat_fine" },
];

const WidthDepthSurface = ({ groove, selectedOptions, setSelectedOptions, activeRing }) => {
  // Helper function to generate storage key based on active ring and groove type
  const getStorageKey = (suffix) => {
    return Array.isArray(activeRing)
      ? `${suffix}_${groove}_${activeRing[0]?.name}_${activeRing[1]?.name}`
      : `${suffix}_${groove}_${activeRing?.name}`;
  };

  // Initialize from localStorage when component mounts or activeRing/groove changes
  useEffect(() => {
    if (!activeRing) return; // Skip if activeRing is not defined
    
    const storageKey = getStorageKey('widthDepthSurface');
    const savedOptions = localStorage.getItem(storageKey);
    
    if (savedOptions) {
      setSelectedOptions(JSON.parse(savedOptions));
    }
  }, [activeRing, groove]);
  
  // Save selectedOptions to localStorage whenever they change
  useEffect(() => {
    if (!activeRing) return; // Skip if activeRing is not defined
    
    const storageKey = getStorageKey('widthDepthSurface');
    localStorage.setItem(storageKey, JSON.stringify(selectedOptions));
  }, [selectedOptions, activeRing, groove]);
  
  const handleInputChange = (id, selected) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [id]: {
        ...prevOptions[id],
        name: selected.name,
        value: selected.value,
      },
    }));
    
    console.log(`Groove ${id} changed to:`, selected.value);
    window.parent.postMessage(
      { 
        action: "addGroove", 
        value: selected.value, 
        type: id,
        ringKey: Array.isArray(activeRing) 
          ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
          : activeRing?.name
      },
      "*"
    );
  };

  return (
    <div className="flex space-x-4 mt-4">
      <div className="flex-1">
        <label>Width</label>
        <SelectField
          options={widthOption}
          selectedOption={selectedOptions.width}
          handleInputChange={handleInputChange}
          id="width"
        />
      </div>
      <div className="flex-1">
        <label>Depth</label>
        <SelectField
          options={depthOption}
          selectedOption={selectedOptions.depth}
          handleInputChange={handleInputChange}
          id="depth"
        />
      </div>
      {groove !== "Milgrain" && (
        <div className="flex-1">
          <label>Surface</label>
          <SelectField
            options={surfaceOption}
            selectedOption={selectedOptions.surface}
            handleInputChange={handleInputChange}
            id="surface"
          />
        </div>
      )}
    </div>
  );
};

export default WidthDepthSurface;