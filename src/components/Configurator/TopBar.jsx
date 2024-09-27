import { Fragment, useState } from "react";
import Modal from "../shared/Modal";
import useModal from "../../hooks/useModal";
import AddRemoveRings from "./AddRemoveRings";
import {
  AddRemoveRingSvg,
  SelectWeddingRingSvg,
  ConnectRingSvg,
} from "../../static/SvgImages";

const ringSvgMap = {
  Wedding: SelectWeddingRingSvg,
  Engagement: SelectWeddingRingSvg,
  Memoir: SelectWeddingRingSvg,
};

export const TopBar = ({ isPair, toggleIsPair, rings, setRings }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [activeRing, setActiveRing] = useState(null);

  const handleRingClick = (ring) => {
    setActiveRing(ring.id);
    console.log(ring)
  };

  return (
    <div className="flex items-center mt-1 bg-[#f1f1f3] lg:px-5 lg:py-2.5">
      <button
        onClick={openModal}
        className="bg-white border px-3.5 py-2 rounded-full lg:inline-flex mr-4 items-center hidden"
      >
        <i icon="ring-add" className="mr-2">
          <AddRemoveRingSvg />
        </i>
        <span className="max-w-28 text-xs font-semibold text-start">
          Add or remove rings
        </span>
      </button>

      <div className="flex justify-between items-center relative w-full lg:w-auto">
        {rings.map((ring, index) => {
          const RingSvg = ringSvgMap[ring.type];
          const isActive = ring.id === activeRing;
          return (
            <Fragment key={index}>
              <button
                key={index}
                onClick={() => handleRingClick(ring)}
                className={`ring-mode-ring ring-mode-ring-profile px-3.5 pb-1 mx-1 cursor-pointer flex-1 border-r lg:border-none border-white ${
                  isActive ? "border-b border-[#205fa8]" : ""
                }`}
              >
                <i className="svg-icon text-center hidden lg:block">
                  <RingSvg className={isActive && "active"} />
                </i>
                <div className="ring-mode-ring-label">{ring.name}</div>
              </button>
              {index === 0 && rings.length > 1 && (
                <div
                  className="ring-mode-connect cursor-pointer mx-2 absolute lg:static left-[45%]"
                  onClick={toggleIsPair}
                >
                  <i
                    icon="connect"
                    className={`svg-icon  rounded-full block text-center ${
                      isPair ? "bg-[#205fa8]" : "bg-white"
                    }`}
                  >
                    <ConnectRingSvg className={isPair ? "#fff" : "#000"} />
                  </i>
                  <span className="connect-label hidden lg:block">
                    Ring pair
                  </span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <button
        onClick={openModal}
        className=" p-2 rounded-full inline-flex items-center lg:hidden"
      >
        <i icon="ring-add" className="mr-2">
          <AddRemoveRingSvg />
        </i>
      </button>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        title="Add or remove rings"
        bodyContent={<AddRemoveRings rings={rings} setRings={setRings} />}
        primaryAction={{ label: "Close", onClick: closeModal }}
      />
    </div>
  );
};
