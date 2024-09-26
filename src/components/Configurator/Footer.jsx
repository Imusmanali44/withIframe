import { RefreshSvg, ReviewSvg } from "../../static/SvgImages";

const ConfiguratorFooter = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between p-4 w-full bg-[#f1f1f3]">
      <div className=" lg:w-[60%] px-5">
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="text-sm ">Ring 1</div>
              <div className="text-sm ">447 €</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm ">Ring 2</div>
              <div className="text-sm ">400 €</div>
            </div>
          </div>
          <div className="flex justify-between mt-2 w-full">
            <div className="text-sm font-semibold">Total price</div>
            <div className="text-sm font-semibold">-</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between lg:flex-col">
        <button className="btn-inline flex items-center gap-1.5 mb-2.5">
          <i className="text-primary svg-icon svg-icon-refresh">
           <RefreshSvg />
          </i>
          <span className="text-sm">Reset configuration</span>
        </button>
        <button className="flex items-center rounded-full bg-white border px-5 py-2 gap-1.5">
          <i className="svg-icon svg-icon-review">
           <ReviewSvg />
          </i>
          <span className="text-sm font-semibold">Your rings</span>
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorFooter;
