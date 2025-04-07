import { useState, useEffect } from "react";
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
    { id: 1, name: "Engagement 1", src: Ring1 },
    { id: 2, name: "Engagement 2", src: Ring1 },
    { id: 3, name: "Engagement 3", src: Ring1 },
    { id: 4, name: "Engagement 4", src: Ring1 },
    { id: 5, name: "Engagement 5", src: Ring1 },
    { id: 6, name: "Engagement 6", src: Ring1 },
    { id: 7, name: "Engagement 7", src: Ring1 },
    { id: 8, name: "Engagement 8", src: Ring1 },
    { id: 9, name: "Engagement 9", src: Ring1 },
    { id: 10, name: "Engagement 10", src: Ring1 },
    { id: 11, name: "Engagement 11", src: Ring1 },
    { id: 12, name: "Engagement 12", src: Ring1 },
    { id: 13, name: "Engagement 13", src: Ring1 },
    { id: 14, name: "Engagement 14", src: Ring1 },
    { id: 15, name: "Engagement 15", src: Ring1 },
    { id: 16, name: "Engagement 16", src: Ring1 },
    { id: 17, name: "Engagement 17", src: Ring1 },
    { id: 18, name: "Engagement 18", src: Ring1 },
    { id: 19, name: "Engagement 19", src: Ring1 },
    { id: 20, name: "Engagement 20", src: Ring1 },
    { id: 21, name: "Engagement 21", src: Ring1 },
    { id: 22, name: "Engagement 22", src: Ring1 },
    { id: 23, name: "Engagement 23", src: Ring1 },
    { id: 24, name: "Engagement 24", src: Ring1 }, // Fixed id and name
    { id: 25, name: "Engagement 25", src: Ring1 }, // Fixed name
    { id: 26, name: "Engagement 26", src: Ring1 }, // Fixed name
    { id: 27, name: "Engagement 27", src: Ring1 }, // Added missing id 27
    { id: 28, name: "Engagement 28", src: Ring1 },
    { id: 29, name: "Engagement 29", src: Ring1 },
    { id: 30, name: "Engagement 30", src: Ring1 },
    { id: 31, name: "Engagement 31", src: Ring1 },
    { id: 32, name: "Engagement 32", src: Ring1 },
    { id: 33, name: "Engagement 33", src: Ring1 },
    { id: 34, name: "Engagement 34", src: Ring1 },
    { id: 35, name: "Engagement 35", src: Ring1 }, // Changed id from 0 to 35
    { id: 36, name: "Engagement 36", src: Ring1 }, // Uncommented and fixed
    { id: 37, name: "Engagement 37", src: Ring1 }, // New entries from here
    { id: 38, name: "Engagement 38", src: Ring1 },
    { id: 39, name: "Engagement 39", src: Ring1 },
    { id: 40, name: "Engagement 40", src: Ring1 },
    { id: 41, name: "Engagement 41", src: Ring1 },
    { id: 42, name: "Engagement 42", src: Ring1 },
    { id: 43, name: "Engagement 43", src: Ring1 },
    { id: 44, name: "Engagement 44", src: Ring1 },
    { id: 45, name: "Engagement 45", src: Ring1 },
    { id: 46, name: "Engagement 46", src: Ring1 },
    { id: 47, name: "Engagement 47", src: Ring1 },
    { id: 48, name: "Engagement 48", src: Ring1 },
    { id: 49, name: "Engagement 49", src: Ring1 },
    { id: 50, name: "Engagement 50", src: Ring1 },
    { id: 51, name: "Engagement 51", src: Ring1 },
    { id: 52, name: "Engagement 52", src: Ring1 },
    { id: 53, name: "Engagement 53", src: Ring1 },
    { id: 54, name: "Engagement 54", src: Ring1 },
    { id: 55, name: "Engagement 55", src: Ring1 },
    { id: 56, name: "Engagement 56", src: Ring1 },
    { id: 57, name: "Engagement 57", src: Ring1 },
    { id: 58, name: "Engagement 58", src: Ring1 },
    { id: 59, name: "Engagement 59", src: Ring1 },
    { id: 60, name: "Engagement 60", src: Ring1 },
    { id: 61, name: "Engagement 61", src: Ring1 },
    { id: 62, name: "Engagement 62", src: Ring1 },
    { id: 63, name: "Engagement 63", src: Ring1 },
    { id: 64, name: "Engagement 64", src: Ring1 }
    // { id: 36, name: "Engagement 36", src: Ring1 },


  ],
  Memoir: [
    { id: 1, name: "Memoir 1", src: Ring1 },
    { id: 2, name: "Memoir 2", src: Ring1 },
    { id: 3, name: "Memoir 3", src: Ring1 },
    { id: 4, name: "Memoir 4", src: Ring1 },
    { id: 5, name: "Memoir 5", src: Ring1 },
    { id: 6, name: "Memoir 6", src: Ring1 },
    { id: 7, name: "Memoir 7", src: Ring1 },
    { id: 8, name: "Memoir 8", src: Ring1 },
    { id: 9, name: "Memoir 9", src: Ring1 },
    { id: 10, name: "Memoir 10", src: Ring1 },
    { id: 11, name: "Memoir 11", src: Ring1 },
    { id: 12, name: "Memoir 12", src: Ring1 },
    { id: 13, name: "Memoir 13", src: Ring1 },
    { id: 14, name: "Memoir 14", src: Ring1 },
    { id: 15, name: "Memoir 15", src: Ring1 },
    { id: 16, name: "Memoir 16", src: Ring1 },
    { id: 17, name: "Memoir 17", src: Ring1 },
    { id: 18, name: "Memoir 18", src: Ring1 },



  ],
};

const AddRemoveRings = ({ rings, setRings }) => {
  const [inputValues, setInputValues] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [selectedRing, setSelectedRing] = useState(null);

  // Effect to send a message when the selectedRing is updated
  useEffect(() => {
    console.log("test", selectedRing)
    if (selectedRing && (selectedRing.name.toLowerCase().includes("engage") || selectedRing.name.toLowerCase().includes("memoir")) ) {
      if(window.ringsLength ==2){
        alert("Delete a wedding ring to add an engagement ring")
        return;
      }
      else{
        window.parent.postMessage({ action: 'addRing', selectedRing }, "*");
        window.ringsLength++;
      }
      

    }

  }, [selectedRing]);

  const addRing = (type) => {
    if (rings.length < 4) {
      if(window.ringsLength ==2){
        alert("only two rings for now")
        return;
      }
      // Find the lowest available ID that's not in use
      const usedIds = rings.map(ring => ring.id);
      let newId = 1;
      while (usedIds.includes(newId)) {
        newId++;
      }
      console.log("type 1", type)
      window.parent.postMessage({ action: 'addRing', type }, "*");
      setRings([
        ...rings,
        { type, id: newId, name: `Ring ${newId}` },
      ]);
      window.ringsLength++;
    }
  };

  const deleteRing = (id) => {
    window.parent.postMessage({ action: 'removeRing', id }, "*");

    setRings(rings.filter((ring) => ring.id !== id));
    console.log("delete", id);
    window.ringsLength--
  };

  const handleInputChange = (id, value) => {
    console.log("ello")
    setInputValues({ ...inputValues, [id]: value });
  };

  const selectRing = (ring) => {
    console.log(" ello 2")

    setSelectedRing(ring);
    if (rings.length < 4) {
      // Find the lowest available ID that's not in use
      const usedIds = rings.map(ring => ring.id);
      let newId = 1;
      while (usedIds.includes(newId)) {
        newId++;
      }

      setRings([
        ...rings,
        { type: selectedType, id: newId, name: ring.name },
      ]);
    }
    setSelectedType(null);
  };

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
          <CloseSvg width={30} height={30} /> Cancel
        </button>
      </div>

      <div
        className={`cards flex flex-col lg:flex-row items-center gap-1 ${
          selectedType && "hidden"
        }`}
      >
        {rings?.map((ring, index) => (
          <div
            key={index}
            className="ring-card border lg:min-h-96 mt-2 p-3.5 lg:w-1/4 flex flex-row lg:flex-col items-center"
          >
            <div className="ring-card-top text-center w-1/3 lg:w-auto">
              <div className="label-dark mb-5 font-semibold">
                {ring.type} Ring
              </div>
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
              <i className="svg-icon text-center">
                <AddWeddingRingSvg />
              </i>
              <h4>Wedding</h4>
            </div>
            <div
  className="ring-type p-3.5 text-center cursor-pointer hover:bg-[#0000000d] duration-300"
  onClick={() => {
    if (window.ringsLength == 2) {
      alert("Delete a wedding ring to add an engagement ring");
      return;
    }
    setSelectedType("Engagement");
  }}
>
              <i className="svg-icon text-center">
                <AddEngagementRingSvg />
              </i>
              <h4>Engagement</h4>
            </div>
            <div
              className="ring-type p-3.5 text-center cursor-pointer hover:bg-[#0000000d] duration-300"
             
              onClick={() => {
                if (window.ringsLength == 2) {
                  alert("Delete a wedding ring to add an engagement ring");
                  return;
                }
                setSelectedType("Memoir");
              }}
            
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
        <div className="bg-white rounded-lg flex flex-wrap w-full max-h-[80vh] lg:max-h-[60vh] overflow-auto">
          {ringImages[selectedType]?.map((ring, index) => (
            <div
              key={index}
              className="cursor-pointer w-1/2 lg:w-1/4"
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
