import { CloseSvg } from "../../static/SvgImages";

const Modal = ({
  isOpen,
  closeModal,
  title,
  bodyContent,
  //   primaryAction,
  //   secondaryAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg  max-w-3xl w-full h-full lg:h-auto">
        <div className="modal-header flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            className="close"
            onClick={closeModal}
          >
            <i className="svg-icon svg-icon-close">
              <CloseSvg />
            </i>
          </button>
        </div>

        <div className="mb-4">{bodyContent}</div>
      </div>
    </div>
  );
};

export default Modal;
