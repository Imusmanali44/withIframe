import { useState } from "react";
import { DropDown } from "./DropDown";
import SelectField from "./shared/SelectField";

export const PreciousMetal = ({
  isPair,
  toggleIsPair,
  isExpert,
  activeRing,
}) => {
  const [purity, setPurity] = useState(9);
  const [partition, setPartition] = useState("Single");

  const partitionOptions = ["Single", "Bi Colored", "Tri Colored"];
  const purityOptions = [9, 14, 18];

  const metalOptions = [
    {
      value: "Gold",
      url: "ui.cdn.confmetrix.com/auronia/production/12.3.5/images/disc/color/585_rotgold.png",
    },
    { value: "Silver" },
    { value: "Platinum" },
    { value: "Apricot Gold" },
    { value: "Palladium" },
    { value: "Rose Gold" },
    { value: "Red Gold" },
    { value: "White Gold" },
    { value: "Yellow Gold" },
  ];

  const surfaceOptions = [
    {
      value: "Vetical matt",
      url: "ui.cdn.confmetrix.com/auronia/production/12.3.5/images/disc/color/585_rotgold.png",
    },
    { value: "Polished" },
    { value: "Diagonal matt" },
    { value: "Ice matt" },
    { value: "Sand matt corse" },
    { value: "Sand matt fine" },
    { value: "Hammered polished" },
    { value: "Hammered san matt" },
    { value: "Milled" },
  ];

  const [selectedMetalOption, setSelectedMetalOption] = useState(
    metalOptions[0].value
  );
  const [selectedSurfaceOption, setSelectedSurfaceOption] = useState(
    surfaceOptions[0].value
  );

  return (
    <div className="precious-metals-form">
      {/* Partition Selection */}
      {isExpert && (
        <>
          <label className="block text-sm font-medium mb-2">Partition</label>
          <div className="flex space-x-2">
            {partitionOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => setPartition(item)}
                className={`w-16 h-16 flex items-center justify-center border rounded-md ${
                  partition === item ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Dropdowns for Metal and Surface */}
      <label className="block text-sm font-medium mt-4 mb-2">
        Color and Surface
      </label>

      <DropDown
        options={metalOptions}
        setSelectedOption={setSelectedMetalOption}
        selectedOption={selectedMetalOption}
      />
      <DropDown
        options={surfaceOptions}
        selectedOption={selectedSurfaceOption}
        setSelectedOption={setSelectedSurfaceOption}
      />

      {/* Purity Display */}
      <div className="mt-4">
        <span className="text-sm">Purity - {selectedMetalOption}</span>
      </div>

      {/* Purity Selection */}
      <div className="mt-4 flex space-x-2">
        {purityOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => setPurity(item)}
            className={`w-12 h-12 flex items-center justify-center border rounded-md ${
              purity === item ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {item} ct
          </button>
        ))}
      </div>

      {/* Expert Surface Selection */}
      {isExpert && (
        <div className="mt-4">
          <DropDown
            options={[{ value: "Select Different Surfaces", url: null }]}
            setSelectedOption={() => {}}
            selectedOption={"Select Different Surfaces"}
          />
        </div>
      )}
    </div>
  );
};
