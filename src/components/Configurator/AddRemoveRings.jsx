import { useState } from "react";
import Input from "../shared/InputField";
import {
  WeddingRingSVg,
  EngagementRingSvg,
  MemoirRingSvg,
  ArrowLeftSvg,
  ArrowRightSvg,
  TrashSvg,
  AddWeddingRingSvg,
  AddEngagementRingSvg,
  AddMemoirRingSvg,
} from "../../static/SvgImages";
import Ring1 from "../../assets/images/VR001.jpeg";
import { CloseSvg } from "../../static/SvgImages";

const ringImages = {
  Engagement: [
    { id: 1, name: "Engagement", src: Ring1 },
    { id: 2, name: "Engagement", src: Ring1 },
  ],
  Memoir: [
    { id: 1, name: "Memoir", src: Ring1 },
    { id: 2, name: "Memoir", src: Ring1 },
  ],
};

const AddRemoveRings = ({ rings, setRings }) => {
  const [inputValues, setInputValues] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [selectedRing, setSelectedRing] = useState(null);

  const addRing = (type) => {
    if (rings.length < 4) {
      setRings([
        ...rings,
        { type, id: rings.length + 1, name: `Ring ${rings.length + 1}` },
      ]);
    }
  };

  const deleteRing = (id) => {
    setRings(rings.filter((ring) => ring.id !== id));
  };

  const handleInputChange = (id, value) => {
    setInputValues({ ...inputValues, [id]: value });
  };

  const selectRing = (ring) => {
    setSelectedRing(ring);
    if (rings.length < 4) {
      setRings([
        ...rings,
        { type: selectedType, id: rings.length + 1, name: ring.name },
      ]);
    }
    setSelectedType(null);
  };

  console.log(selectedRing)

  return (
    <>
      <div className="flex items-center justify-between py-3 border-b">
        <div className="flex items-center">
          <h4 className="text-sx py-3 text-center lg:text-start">Your rings</h4>
          {selectedType && (
            <div className="flex items-center">
              <span className="text-black mx-1">{">"}</span>
              <h3 className="m-0 text-black">Add {selectedType} Ring</h3>
            </div>
          )}
        </div>

        <button
          className={`border px-2 py-1.5 rounded hidden gap-2  ${
            selectedType && "!flex"
          }`}
          onClick={() => setSelectedType(null)}
        >
          <CloseSvg /> Cancel
        </button>
      </div>

      <div
        className={`cards flex flex-col lg:flex-row items-center gap-3 ${
          selectedType && "hidden"
        }`}
      >
        {rings?.map((ring, index) => (
          <div
            key={index}
            className="ring-card border lg:min-h-96 mt-2 p-3.5 lg:w-1/4 flex flex-row lg:flex-col items-center"
          >
            <div className="ring-card-top text-center w-1/3 lg:w-auto">
              <div className="label-dark mb-5 font-bold">{ring.type} Ring</div>
              <i className="ring-card-img max-w-32">
                {ring.type === "Wedding" && <WeddingRingSVg />}
                {ring.type === "Engagement" && <EngagementRingSvg />}
                {ring.type === "Memoir" && <MemoirRingSvg />}
              </i>
            </div>
            <div className="ring-card-bottom pl-3 lg:pl-0 w-2/3 lg:w-auto">
              <div className="my-1">
                <label className="label-dark py-1 inline-block">
                  Enter Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter some text"
                  value={inputValues[ring.id] || ring.name}
                  onChange={(e) => handleInputChange(ring.id, e.target.value)}
                />
              </div>
              <div className="flex flex-row lg:flex-col">
                <div className="flex items-center justify-between my-2.5 ">
                  <button className="p-1 rotate-90 lg:rotate-0">
                    <ArrowLeftSvg />
                  </button>
                  <span className="hidden lg:flex">Shift</span>
                  <button className="p-1 rotate-90 lg:rotate-0">
                    <ArrowRightSvg />
                  </button>
                </div>
                <button
                  className="flex items-center justify-center w-full px-3 py-2"
                  onClick={() => deleteRing(ring.id)}
                >
                  <i icon="trash-2" className="mr-2">
                    <TrashSvg />
                  </i>
                  <span>To delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Ring Slot Section */}
        {rings?.length < 4 && (
          <div className="ring-card-slot border border-dashed bg-[#f2f2f2] lg:min-h-96 mt-2 p-3.5 w-full lg:w-1/4 flex lg:flex-col lg:justify-center justify-between">
            <div
              className="ring-type p-3.5 text-center cursor-pointer hover:bg-[#0000000d] duration-300"
              onClick={() => addRing("Wedding")}
            >
              <i className="svg-icon text-center" onClick={""}>
                <AddWeddingRingSvg />
              </i>
              <h4>Wedding</h4>
            </div>
            <div
              className="ring-type p-3.5 text-center cursor-pointer hover:bg-[#0000000d] duration-300"
              onClick={() => setSelectedType("Engagement")}
            >
              <i className="svg-icon text-center">
                <AddEngagementRingSvg />
              </i>
              <h4>Engagement</h4>
            </div>
            <div
              className="ring-type p-3.5 text-center cursor-pointer hover:bg-[#0000000d] duration-300"
              onClick={() => setSelectedType("Memoir")}
            >
              <i className="svg-icon text-center">
                <AddMemoirRingSvg />
              </i>
              <h4>Memoir</h4>
            </div>
          </div>
        )}
      </div>
      {selectedType && (
        <div className="bg-white rounded-lg flex flex-wrap gap-3 w-full">
          {ringImages[selectedType]?.map((ring, index) => (
            <div
              key={index}
              className="cursor-pointer w-1/4"
              onClick={() => selectRing(ring)}
            >
              <img src={ring.src} alt={ring.name} className="w-full h-auto" />
              <div className="flex flex-col justify-center items-center">
                <h3 className="m-0 text-black font-semibold">{ring.name}</h3>
                <span>0.40 ct</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AddRemoveRings;
