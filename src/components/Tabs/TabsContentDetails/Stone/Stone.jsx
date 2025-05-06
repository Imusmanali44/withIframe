import { useState, useEffect } from "react";
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
  // Create a key change tracker to force reset when ring changes
  const [ringKey, setRingKey] = useState(() => {
    return Array.isArray(activeRing) 
      ? `${activeRing[0]?.name}_${activeRing[1]?.name}`
      : `${activeRing?.name}`;
  });

  // Initialize states from localStorage or use defaults
  const [selectedOption, setSelectedOption] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneColorPurity_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneColorPurity_${activeRing?.name}`;
    
    return localStorage.getItem(storageKey) || undefined;
  });

  const [option, setOption] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneOption_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneOption_${activeRing?.name}`;
    
    return parseInt(localStorage.getItem(storageKey) || "2");
  });

  const [stones, setStones] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stones_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stones_${activeRing?.name}`;
    
    const savedStones = localStorage.getItem(storageKey);
    return savedStones ? JSON.parse(savedStones) : [];
  });

  const [activeTab, setActiveTab] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneActiveTab_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneActiveTab_${activeRing?.name}`;
    
    return parseInt(localStorage.getItem(storageKey) || "1");
  });

  const [stoneSize, setStoneSize] = useState(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneSize_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneSize_${activeRing?.name}`;
    
    return localStorage.getItem(storageKey) || "0.005 ct. (Ø 1.0 mm)";
  });

  // Key effect to detect ring changes and reset state
  useEffect(() => {
    const newRingKey = Array.isArray(activeRing) 
      ? `${activeRing[0]?.name}_${activeRing[1]?.name}`
      : `${activeRing?.name}`;
    
    // If ring has changed, update all states from localStorage
    if (newRingKey !== ringKey) {
      setRingKey(newRingKey);
      
      // Reset selectedOption for new ring
      const optionKey = `stoneColorPurity_${newRingKey}`;
      setSelectedOption(localStorage.getItem(optionKey) || undefined);
      
      // Reset option for new ring
      const stoneOptionKey = `stoneOption_${newRingKey}`;
      setOption(parseInt(localStorage.getItem(stoneOptionKey) || "2"));
      
      // Reset stones for new ring
      const stonesKey = `stones_${newRingKey}`;
      const savedStones = localStorage.getItem(stonesKey);
      setStones(savedStones ? JSON.parse(savedStones) : []);
      
      // Reset activeTab for new ring
      const tabKey = `stoneActiveTab_${newRingKey}`;
      setActiveTab(parseInt(localStorage.getItem(tabKey) || "1"));
      
      // Reset stoneSize for new ring
      const sizeKey = `stoneSize_${newRingKey}`;
      setStoneSize(localStorage.getItem(sizeKey) || "0.005 ct. (Ø 1.0 mm)");
    }
  }, [activeRing, ringKey]);

  // Save selectedOption to localStorage when it changes
  useEffect(() => {
    if (selectedOption) {
      const storageKey = Array.isArray(activeRing) 
        ? `stoneColorPurity_${activeRing[0]?.name}_${activeRing[1]?.name}` 
        : `stoneColorPurity_${activeRing?.name}`;
      
      localStorage.setItem(storageKey, selectedOption);
    }
  }, [selectedOption, activeRing]);

  // Save option to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneOption_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneOption_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, option.toString());
  }, [option, activeRing]);

  // Save stones to localStorage when they change
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stones_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stones_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, JSON.stringify(stones));
  }, [stones, activeRing]);

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneActiveTab_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneActiveTab_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, activeTab?.toString() || "");
  }, [activeTab, activeRing]);

  // Save stoneSize to localStorage when it changes
  useEffect(() => {
    const storageKey = Array.isArray(activeRing) 
      ? `stoneSize_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `stoneSize_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, stoneSize);
  }, [stoneSize, activeRing]);

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
          stoneSize={stoneSize}
          setStoneSize={setStoneSize}
          selectedOption={selectedOption}
          handleChange={handleChange}
          activeRing={activeRing}
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
              <div>
                <div className="py-10 flex items-center gap-2">
                  <CheckSvg />
                  <p className="text-black font-semibold">{stoneSize}</p>
                </div>
                <StoneColorPurity
                  stoneSize={stoneSize}
                  selectedOption={selectedOption}
                  handleChange={handleChange}
                  activeRing={activeRing}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};