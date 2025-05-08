import { useState } from "react";
import { PreciousMetalSelectBox } from "./PreciousMetalSelectBox";

export const ColorSurface = ({
  isWeddingRing,
  isExpert,
  metalOptions,
  updateSelection,
  surfaceOptions,
  purityOptions,
  selections,
  selectedPartitionTwotoneImg,
  selectedPartitionTriColoredImg,
  activeRing,
}) => {
  const [activeTab, setActiveTab] = useState("single");

  // Function to pass ring identifier with updateSelection
  const handleUpdateSelection = (partition, field, value) => {
    updateSelection(partition, field, value);
  };

  return (
    <>
      <label className="block text-sm font-medium mt-4">
        Color and Surface
      </label>

      <div className="sm:hidden flex justify-between border-b mb-4">
        <button
          onClick={() => setActiveTab("single")}
          className={`py-2 px-4 ${
            activeTab === "single"
              ? "border-b-2 border-blue-500 text-blue-500"
              : ""
          }`}
        >
          Single
        </button>
        {selectedPartitionTwotoneImg && (
          <button
            onClick={() => setActiveTab("twoTone")}
            className={`py-2 px-4 ${
              activeTab === "twoTone"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
          >
            Two-Tone
          </button>
        )}
        {selectedPartitionTriColoredImg && (
          <button
            onClick={() => setActiveTab("triColored")}
            className={`py-2 px-4 ${
              activeTab === "triColored"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
          >
            Tri-Colored
          </button>
        )}
      </div>

      <div className="flex gap-3">
        {/* Always show first color section */}
        <div className={`flex-1`}>
          <PreciousMetalSelectBox
            options={metalOptions}
            setSelectedOption={(value) =>
              handleUpdateSelection(selectedPartitionTriColoredImg ? "triColored1" : "single", "metal", value)
            }
            selectedOption={selectedPartitionTriColoredImg ? selections.triColored.metal1 || selections.single.metal : selections.single.metal}
          />
          {isWeddingRing && isExpert && (
            <PreciousMetalSelectBox
              options={surfaceOptions}
              selectedOption={selectedPartitionTriColoredImg ? selections.triColored.surface1 || selections.single.surface : selections.single.surface}
              setSelectedOption={(value) =>
                handleUpdateSelection(selectedPartitionTriColoredImg ? "triColored1" : "single", "surface", value)
              }
            />
          )}
          {/* Purity Selection */}
          <div className="py-1">
            <span className="text-sm font-semibold">
              Cleanliness - {selectedPartitionTriColoredImg 
                ? (selections.triColored.metal1?.value || selections.single.metal?.value) 
                : selections.single.metal?.value}
            </span>
          </div>
          <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
            {purityOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleUpdateSelection(selectedPartitionTriColoredImg ? "triColored1" : "single", "purity", item)}
                className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                  (selectedPartitionTriColoredImg ? selections.triColored.purity1 : selections.single.purity) === item
                    ? "border border-[#205fa8]"
                    : "bg-white"
                }`}
              >
                {item} kt
              </button>
            ))}
          </div>
        </div>

        {/* Show second color section for two-tone or tri-colored */}
        {(selectedPartitionTwotoneImg || selectedPartitionTriColoredImg) && (
          <div className="flex-1">
            <PreciousMetalSelectBox
              options={metalOptions}
              setSelectedOption={(value) =>
                handleUpdateSelection(selectedPartitionTriColoredImg ? "triColored2" : "twoTone", "metal", value)
              }
              selectedOption={selectedPartitionTriColoredImg ? selections.triColored.metal2 || selections.twoTone.metal : selections.twoTone.metal}
            />
            {isWeddingRing && isExpert && (
              <PreciousMetalSelectBox
                options={surfaceOptions}
                selectedOption={selectedPartitionTriColoredImg ? selections.triColored.surface2 || selections.twoTone.surface : selections.twoTone.surface}
                setSelectedOption={(value) =>
                  handleUpdateSelection(selectedPartitionTriColoredImg ? "triColored2" : "twoTone", "surface", value)
                }
              />
            )}
            {/* Purity Selection */}
            <div className="py-1">
              <span className="text-sm font-semibold">
                Cleanliness - {selectedPartitionTriColoredImg 
                  ? (selections.triColored.metal2?.value || selections.twoTone.metal?.value) 
                  : selections.twoTone.metal?.value}
              </span>
            </div>
            <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
              {purityOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleUpdateSelection(selectedPartitionTriColoredImg ? "triColored2" : "twoTone", "purity", item)}
                  className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                    (selectedPartitionTriColoredImg ? selections.triColored.purity2 : selections.twoTone.purity) === item
                      ? "border border-[#205fa8]"
                      : "bg-white"
                  }`}
                >
                  {item} kt
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show third color section only for tri-colored */}
        {selectedPartitionTriColoredImg && (
          <div className="flex-1">
            <PreciousMetalSelectBox
              options={metalOptions}
              setSelectedOption={(value) =>
                handleUpdateSelection("triColored3", "metal", value)
              }
              selectedOption={selections.triColored.metal3 || selections.triColored.metal}
            />
            {isWeddingRing && isExpert && (
              <PreciousMetalSelectBox
                options={surfaceOptions}
                selectedOption={selections.triColored.surface3 || selections.triColored.surface}
                setSelectedOption={(value) =>
                  handleUpdateSelection("triColored3", "surface", value)
                }
              />
            )}
            {/* Purity Selection */}
            <div className="py-1">
              <span className="text-sm font-semibold">
                Cleanliness - {selections.triColored.metal3?.value || selections.triColored.metal?.value}
              </span>
            </div>
            <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
              {purityOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleUpdateSelection("triColored3", "purity", item)}
                  className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                    selections.triColored.purity3 === item
                      ? "border border-[#205fa8]"
                      : "bg-white"
                  }`}
                >
                  {item} kt
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
