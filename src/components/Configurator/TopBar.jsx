// var currentModel = 0
// var isPair1 = 0
import { Fragment, useEffect } from "react";
import Modal from "../shared/Modal";
import useModal from "../../hooks/useModal";
import AddRemoveRings from "./AddRemoveRings";
import { useLocalization } from "../../context/LocalizationContext";
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

export const TopBar = ({
  isPair,
  setIsPair,
  rings,
  setRings,
  activeRing,
  setActiveRing,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useLocalization();

  useEffect(() => {
    if (rings.length >= 2) {
      setActiveRing(rings[0]);
    }
  }, [rings]);

  const handleRingClick = (ring) => {
    setActiveRing(ring);
    console.log(ring, rings.length,"aaaaaaa");
    window.selectedRing = ring.id;
    window.ringsLength = rings.length;
    window.parent.postMessage({ action: 'selectModel', modelId: ring.id }, "*");

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
          {t('configurator.addOrRemoveRings')}
        </span>
      </button>

      <div className="flex justify-between items-center relative w-full lg:w-auto">
        {rings.map((ring, index) => {
          const RingSvg = ringSvgMap[ring.type];
          const isActive = Array.isArray(activeRing)
            ? activeRing.some((r) => r.id === ring.id)
            : ring.id === activeRing?.id;
          return (
            <Fragment key={index}>
              <button
                key={index}
                onClick={() => handleRingClick(ring)}
                className={`ring-mode-ring ring-mode-ring-profile px-3.5 pb-1 mx-1 cursor-pointer  border-r lg:border-none border-white ${
                  isActive ? "border-b border-[#205fa8]" : ""
                }`}
              >
                <i className="svg-icon text-center hidden lg:block">
                  <RingSvg className={isActive && "active"} />
                </i>
                <div className="ring-mode-ring-label">{ring.name}</div>
              </button>
              {index === 0 &&
                rings.length > 1 &&
                rings[0]?.type === rings[1]?.type && (
                  <div
                    className="ring-mode-connect cursor-pointer mx-2 absolute lg:static left-[45%]"
                    onClick={() =>
                      setIsPair((prevState) => ({
                        ...prevState,
                        pair1: !isPair.pair1,
                      }))
                    }
                  >
                    <i
                      icon="connect"
                      className={`svg-icon  rounded-full block text-center ${
                        isPair.pair1 ? "bg-[#205fa8]" : "bg-white"
                      }`}
                    >
                      <ConnectRingSvg className={isPair.pair1 ? "#fff" : "#000"} />
                    </i>
                    <span className="connect-label hidden lg:block">
                      {t('configurator.ringPair')}
                    </span>
                  </div>
                )}

              {index === 2 && rings[2]?.type === rings[3]?.type && (
                <div
                  className="ring-mode-connect cursor-pointer mx-2 absolute lg:static left-[45%]"
                  onClick={() =>
                    setIsPair((prevState) => ({
                      ...prevState,
                      pair2: !isPair.pair2,
                    }))
                  }
                >
                  <i
                    icon="connect"
                    className={`svg-icon  rounded-full block text-center ${
                      isPair.pair2 ? "bg-[#205fa8]" : "bg-white"
                    }`}
                  >
                    <ConnectRingSvg className={isPair.pair2 ? "#fff" : "#000"} />
                  </i>
                  <span className="connect-label hidden lg:block">
                    {t('configurator.ringPair')}
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
        title={t('configurator.addOrRemoveRings')}
        bodyContent={<AddRemoveRings rings={rings} setRings={setRings} />}
        primaryAction={{ label: t('buttons.close'), onClick: closeModal }}
      />
    </div>
  );
};
