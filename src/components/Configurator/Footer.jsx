import { RefreshSvg, ReviewSvg } from "../../static/SvgImages";
import Modal from "../shared/Modal";
import useModal from "../../hooks/useModal";
import RingDetails from "./RingDetails";

const ConfiguratorFooter = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const handleResetConfiguration = () => {
    console.log('Reset configuration')
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row p-4 w-full bg-[#f1f1f3]">
      <div className="lg:w-[60%] px-5 lg:border-r-2 border-white pt-3 lg:pt-0">
        <div className="flex flex-col items-center max-w-[300px]">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="text-sm ">Ring 1</div>
              <div className="text-sm ">447-€</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm ">Ring 2</div>
              <div className="text-sm ">400-€</div>
            </div>
          </div>
          <div className="flex justify-between mt-2 w-full">
            <div className="text-sm font-semibold">Total price</div>
            <div className="text-sm font-semibold">847,- €</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between lg:flex-col px-7 border-b-2 lg:border-b-0 border-white pb-3 lg:pb-0">
        <button className="btn-inline flex items-center gap-1.5 lg:mb-2.5" onClick={handleResetConfiguration}>
          <i className="text-primary svg-icon svg-icon-refresh">
            <RefreshSvg />
          </i>
          <span className="text-sm">Reset configuration</span>
        </button>
        <button
          className="flex items-center rounded-full bg-white border px-5 py-2 gap-1.5"
          onClick={openModal}
        >
          <i className="svg-icon svg-icon-review">
            <ReviewSvg />
          </i>
          <span className="text-sm font-semibold">Your rings</span>
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        title="Your rings"
        bodyContent={<RingDetails />}
        primaryAction={{ label: "Close", onClick: closeModal }}
      />
    </div>
  );
};

export default ConfiguratorFooter;
