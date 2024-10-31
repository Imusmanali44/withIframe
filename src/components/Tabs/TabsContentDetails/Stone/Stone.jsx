import { useState } from "react";
import {
  WithStoneSvg,
  WithoutStoneSvg,
  CheckSvg,
  AddStoneSvg,
  StoneSvg,
} from "../../../../static/SvgImages";
import StoneColorPurity from "./StoneColorPurity";
import TabContent from "./TabContent";

export const Stone = ({
  rings,
  activeRing,
  isPair,
  setIsPair,
  isExpertMode,
}) => {
  const [selectedOption, setSelectedOption] = useState();
  const [option, setOption] = useState(2);
  const [stones, setStones] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const addStone = () => {
    if (stones.length < 3) {
      const newStone = { id: stones.length + 1 };
      setStones([...stones, newStone]);
      setActiveTab(newStone.id);
    }
  };

  const removeStone = (id) => {
    const updatedStones = stones.filter((stone) => stone.id !== id);
    setStones(updatedStones);

    if (updatedStones.length > 0) {
      setActiveTab(updatedStones[updatedStones.length - 1].id);
    } else {
      setActiveTab(null);
    }
  };

  return (
    <div className="mb-auto">
      {/* Tab buttons */}
      <div className="bg-[#e1e1e1] flex">
        {stones.map((stone, index) => (
          <button
            key={stone.id}
            onClick={() => setActiveTab(stone.id)}
            className={`py-3 px-5 font-semibold flex items-center gap-2 ${
              activeTab === stone.id ? "bg-[#f9f9fa] text-black text-lg" : ""
            }`}
          >
            <StoneSvg /> {index + 1}
          </button>
        ))}
      </div>
      {stones.length !== 0 && (
        <TabContent
          isPair={isPair}
          activeTab={activeTab}
          stones={stones}
          setStones={setStones}
          addStone={addStone}
          removeStone={removeStone}
        />
      )}
      <div className="max-w-lg mx-auto">
        {isExpertMode ? (
          <>
            {stones.length === 0 && (
              <div className="flex items-center gap-3 py-10">
                <AddStoneSvg />
                <div>
                  <p className="mb-4">
                    Here you can set the ring with a stone.
                  </p>
                  <button
                    onClick={addStone}
                    className={`p-3 uppercase bg-white font-semibold text-sm border flex items-center gap-2 border-[#205fa8]`}
                  >
                    Add stone
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex mt-6 gap-2">
              <button
                onClick={() => setOption(1)}
                className={`p-3 uppercase bg-white font-semibold text-sm border flex items-center gap-2 ${
                  option === 1 ? "border-[#205fa8]" : ""
                }`}
              >
                <WithStoneSvg />
                with stone
              </button>
              <button
                onClick={() => setOption(2)}
                className={`p-3 uppercase bg-white font-semibold text-sm border flex items-center gap-2 ${
                  option === 2 ? "border-[#205fa8]" : ""
                }`}
              >
                <WithoutStoneSvg />
                without stone
              </button>
            </div>
            {option === 1 && (
              <>
                {stones.map((stone) => (
                  <div key={stone.id}>
                    {activeTab === stone.id && (
                      <div className="py-10 flex items-center gap-2">
                        <CheckSvg />
                        <p className="text-black font-semibold">
                          1 x 0.015 ct G/SI Brilliant Pavé for Stone {stone.id}
                        </p>
                      </div>
                    )}
                    <StoneColorPurity
                      selectedOption={selectedOption}
                      handleChange={handleChange}
                    />
                  </div>
                ))}
                {stones.length < 3 && (
                  <button
                    onClick={addStone}
                    className={`p-3 mt-4 uppercase bg-white font-semibold text-sm border flex items-center gap-2 border-[#205fa8]`}
                  >
                    Add another stone
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
