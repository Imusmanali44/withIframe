import {
  DeleteSvg,
  LoadSaveSvg,
  PrintSvg,
  ShareSvg,
} from "../../static/SvgImages";

const TabContentFooter = () => {
  const handleDeleteClick = () => {
    console.log("Delete button clicked");
  };

  const handleLoadSaveClick = () => {
    console.log("Load/Save button clicked");
  };

  const handlePrintClick = () => {
    console.log("Print PDF button clicked");
  };

  const handleShareClick = () => {
    console.log("Share button clicked");
  };

  return (
    <div className="hidden lg:flex justify-between p-7 space-x-4">
      <button
        className="btn-inline disabled flex items-center space-x-2 text-xs font-semibold"
        onClick={handleDeleteClick}
      >
        <i className="svg-icon svg-icon-revert">
          <DeleteSvg />
        </i>
        <span>To delete</span>
      </button>

      <button
        className="btn-inline flex items-center space-x-2 text-xs font-semibold"
        onClick={handleLoadSaveClick}
      >
        <i className="svg-icon svg-icon-save-load">
          <LoadSaveSvg />
        </i>
        <span>Load / Save</span>
      </button>

      <button
        className="btn-inline flex items-center space-x-2 text-primary text-xs font-semibold"
        onClick={handlePrintClick}
      >
        <i className="svg-icon svg-icon-print">
          <PrintSvg />
        </i>
        <span>Print PDF</span>
      </button>

      <button
        className="btn-inline flex items-center space-x-2 text-primary text-xs font-semibold"
        onClick={handleShareClick}
      >
        <i className="svg-icon svg-icon-print">
          <ShareSvg />
        </i>
        <span>To Share</span>
      </button>
    </div>
  );
};

export default TabContentFooter;
