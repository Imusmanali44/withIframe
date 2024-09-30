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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg  max-w-3xl w-full mx-auto lg:my-10 min-h-screen lg:min-h-fit">
        <div className="modal-header flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            className="close"
            onClick={closeModal}
          >
            <i className="svg-icon svg-icon-close">
              <CloseSvg width={30} height={30} />
            </i>
          </button>
        </div>

        <div className="mb-4">{bodyContent}</div>
      </div>
    </div>
  );
};

export default Modal;
