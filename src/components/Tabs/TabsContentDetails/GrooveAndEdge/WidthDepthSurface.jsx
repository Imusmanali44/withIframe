import { SelectField } from "../../../shared/SelectField";

const widthOption = [
  { name: "0.20 mm", value: "0.20" },
  { name: "0.30 mm", value: "0.30" },
  { name: "0.40 mm", value: "0.40" },
  { name: "0.50 mm", value: "0.50" },
  // { name: "0.60 mm", value: "0.60" },
];

const depthOption = [
  { name: "0.20 mm", value: "0.20" },
  { name: "0.30 mm", value: "0.30" },
  { name: "0.40 mm", value: "0.40" },
  // { name: "0.50 mm", value: "0.50" },
  // { name: "0.60 mm", value: "0.60" },
];

const surfaceOption = [
  { name: "Polished", value: "polished" },
  { name: "Sand mat fine", value: "sand_mat_fine" },
];

const WidthDepthSurface = ({ groove, selectedOptions, setSelectedOptions }) => {
    
  const handleInputChange = (id, selected) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [id]: {
        ...prevOptions[id],
        name: selected.name,
        value: selected.value,
      },
      
    }));
    console.log(`Groove ${id} changed to:`, id);
    window.parent.postMessage(
      { action: "addGroove", value: selected.value , type: id },
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
