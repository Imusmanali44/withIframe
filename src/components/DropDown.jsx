export const DropDown = ({
  options,
  setSelectedOption,
  selectedOption,
  isImageLess,
}) => {
  const url =
    selectedOption.url ||
    "ui.cdn.confmetrix.com/auronia/production/12.3.5/images/disc/color/585_rotgold.png";

  return (
    <div className="dropdown-hover">
      {!isImageLess && (
        <div
          className="ring-color"
          style={{
            backgroundImage: !isImageLess ? `url(${url})` : "",
          }}
        ></div>
      )}

      <select
        id="dropdown"
        className="dropdown"
        style={{ width: isImageLess ? "150px" : "400px" }}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.vale} value={option.value}>
            <div
              className="ring-color"
              style={{
                backgroundImage: `url(${url ?? "default"})`,
              }}
            ></div>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};
