import { AddSvg, TrashSvg } from "../../../../static/SvgImages";

const TabContent = ({ isPair, activeTab, stones, addStone, removeStone }) => {
  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      <div className="flex items-center gap-5">
        {stones.length < 3 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={addStone}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <AddSvg />
            </div>
            Add stone group
          </div>
        )}
        {stones.length > 1 && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => removeStone(activeTab)}
          >
            <div className="bg-white rounded-full border w-8 h-8 flex items-center justify-center">
              <TrashSvg className={"text-inherit w-6"} />
            </div>
            Remove stone group
          </div>
        )}
      </div>
    </div>
  );
};

export default TabContent;
