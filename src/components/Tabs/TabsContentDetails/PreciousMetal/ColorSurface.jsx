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
}) => {
  const [activeTab, setActiveTab] = useState("single");

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
        {/* {(activeTab === "single" || !activeTab) && ( */}
        <div className={`flex-1`}>
          <PreciousMetalSelectBox
            options={metalOptions}
            setSelectedOption={(value) =>
              updateSelection("single", "metal", value)
            }
            selectedOption={selections.single.metal}
          />
          {isWeddingRing && isExpert && (
            <PreciousMetalSelectBox
              options={surfaceOptions}
              selectedOption={selections.single.surface}
              setSelectedOption={(value) =>
                updateSelection("single", "surface", value)
              }
            />
          )}
          {/* Purity Selection */}
          <div className="py-1">
            <span className="text-sm font-semibold">
              Cleanliness - {selections.single.metal?.value}
            </span>
          </div>
          <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
            {purityOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => updateSelection("single", "purity", item)}
                className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                  selections.single.purity === item
                    ? "border border-[#205fa8]"
                    : "bg-white"
                }`}
              >
                {item} kt
              </button>
            ))}
          </div>
        </div>
        {/* )} */}

        {selectedPartitionTwotoneImg && (
          <div className="flex-1">
            <PreciousMetalSelectBox
              options={metalOptions}
              setSelectedOption={(value) =>
                updateSelection("twoTone", "metal", value)
              }
              selectedOption={selections.twoTone.metal}
            />
            {isWeddingRing && isExpert && (
              <PreciousMetalSelectBox
                options={surfaceOptions}
                selectedOption={selections.twoTone.surface}
                setSelectedOption={(value) =>
                  updateSelection("twoTone", "surface", value)
                }
              />
            )}
            {/* Purity Selection */}
            <div className="py-1">
              <span className="text-sm font-semibold">
                Cleanliness - {selections.twoTone.metal?.value}
              </span>
            </div>
            <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
              {purityOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => updateSelection("twoTone", "purity", item)}
                  className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                    selections.twoTone.purity === item
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

        {selectedPartitionTriColoredImg && (
          <div className="flex-1">
            <PreciousMetalSelectBox
              options={metalOptions}
              setSelectedOption={(value) =>
                updateSelection("triColored", "metal", value)
              }
              selectedOption={selections.triColored.metal}
            />
            {isWeddingRing && isExpert && (
              <PreciousMetalSelectBox
                options={surfaceOptions}
                selectedOption={selections.triColored.surface}
                setSelectedOption={(value) =>
                  updateSelection("triColored", "surface", value)
                }
              />
            )}
            {/* Purity Selection */}
            <div className="py-1">
              <span className="text-sm font-semibold">
                Cleanliness - {selections.triColored.metal?.value}
              </span>
            </div>
            <div className="flex flex-wrap space-x-1 space-y-1 mb-5">
              {purityOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => updateSelection("triColored", "purity", item)}
                  className={`px-2.5 py-3 flex items-center justify-center border rounded-0 ${
                    selections.triColored.purity === item
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
