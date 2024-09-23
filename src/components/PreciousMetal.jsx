import { useState } from "react";
import { DropDown } from "./DropDown";

export const PreciousMetal = ({ isPair, toggleIsPair, isExpert }) => {
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
    <>
      <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
      >
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
        />
        <label  style={{ marginRight: "10px" }}>
          Use the same settings for both rings
        </label>
      </div>

      <div className="precious-metals-form">
        {isExpert && (
          <>
            <label htmlFor="partition">Partition</label>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "row",
              }}
            >
              {partitionOptions.map((item, index) => (
                <button
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                  key={index}
                  onClick={() => setPartition(item)}
                  className={`stone-setting ${
                    partition === item && "active-stone-setting"
                  } `}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        <label htmlFor="dropdown">Color and surface</label>
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
        <div>Purity - {selectedMetalOption || ""}</div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          {purityOptions.map((item, index) => (
            <button
              style={{
                width: "50px",
                height: "50px",
              }}
              key={index}
              onClick={() => setPurity(item)}
              className={`stone-setting ${
                purity === item && "active-stone-setting"
              } `}
            >
              {item} ct
            </button>
          ))}
        </div>

        {isExpert && (
          <DropDown
            options={[{ value: "Select Different Surfaces", url: null }]}
            setSelectedOption={() => {}}
            selectedOption={"Select Different Surfaces"}
          />
        )}
      </div>
    </>
  );
};
