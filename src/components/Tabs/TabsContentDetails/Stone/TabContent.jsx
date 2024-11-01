import { useState } from "react";
import { AddSvg, TrashSvg } from "../../../../static/SvgImages";
import StoneColorPurity from "./StoneColorPurity";

const RingStoneStyleOptions = [
  {
    name: "Without",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/preset/none.svg",
  },
  {
    name: "Smooth conversion",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/preset/bezel.svg",
  },
  {
    name: "Pavé",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/preset/section.svg",
  },
  {
    name: "Rail setting",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/preset/channel.svg",
  },
  {
    name: "Rail setting across",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/preset/cross-channel.svg",
  },
];

const RingStoneTypeOptions = [
  {
    name: "Brilliant",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/cut/brilliant.svg",
  },
  {
    name: "Princess",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/cut/princess.svg",
  },
  {
    name: "Baguette",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/stone/cut/baguette.svg",
  },
];

const StoneSizeOptions = [
  "0.005 ct. (Ø 1.0 mm)",
  "0.005 ct. (Ø 1.3 mm)",
  "0.005 ct. (Ø 1.5 mm)",
];

const TabButton = ({ label, currentTab, setTab }) => (
  <button
    onClick={() => setTab(label)}
    className={`font-semibold ${
      currentTab === label
        ? "text-[#205fa8] border-b border-[#205fa8]"
        : "text-[#626262]"
    }`}
  >
    {label}
  </button>
);

const TabContent = ({
  isPair,
  activeTab,
  stones,
  addStone,
  removeStone,
  stoneSize,
  setStoneSize,
}) => {
  const [currentTab, setCurrentTab] = useState("Settings");
  const [stoneStyle, setStoneStyle] = useState("Without");
  const [stoneType, setStoneType] = useState("Without");

  const renderTabContent = () => {
    switch (currentTab) {
      case "Settings":
        return (
          <div className="flex flex-wrap gap-2.5">
            {RingStoneStyleOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => setStoneStyle(item.name)}
                className={`bg-white w-[calc(34%-10px)] lg:w-[calc(25%-10px)] border flex flex-col justify-between items-center pt-3 hover:border-[#205fa8] ${
                  stoneStyle === item.name
                    ? "border-[#205fa8]"
                    : "border-[#e1e1e1]"
                }`}
              >
                <span className="mx-2 text-sm leading-none">{item.name}</span>
                <img src={item.img} className="mx-auto mt-3" alt={item.name} />
              </button>
            ))}
          </div>
        );
      case "Type of Stone":
        return (
          <div>
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-sm text-black">
                Grinding
              </h3>
              <div className="flex items-start space-x-2 ">
                {RingStoneTypeOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setStoneType(item.name)}
                    className={`bg-white w-full border p-2 ${
                      stoneType === item.name
                        ? "border-[#205fa8]"
                        : "border-[#e1e1e1]"
                    }`}
                  >
                    <span className="text-sm">{item.name}</span>
                    <img
                      src={item.img}
                      className="mx-auto mt-1 w-16 h-16"
                      alt={item.name}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-sm text-black">
                Stone size
              </h3>
              <select
                value={stoneSize}
                onChange={(e) => setStoneSize(e.target.value)}
                className="border border-[#e1e1e1] p-2 rounded w-full"
              >
                {StoneSizeOptions.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <StoneColorPurity />
          </div>
        );
      case "Number":
        return <p>Number Content</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      {/* Add and remove stone buttons */}
      <div className="flex items-center gap-5">
        {stones.length < 3 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={addStone}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <AddSvg />
            </div>
            Add stone group
          </div>
        )}
        {stones.length > 1 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => removeStone(activeTab)}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <TrashSvg className={"text-inherit w-6"} />
            </div>
            Remove stone group
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
