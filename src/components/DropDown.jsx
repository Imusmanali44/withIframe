export const DropDown = ({
  options,
  setSelectedOption,
  selectedOption,
  isImageLess,
}) => {
  // Fallback URL if none is provided for an option
  const defaultUrl =
    "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/disc/color/585_rotgold.png";

  // Get URL from selected option, or use default
  const url = selectedOption?.url || defaultUrl;

  return (
    <div className="relative flex">
      {!isImageLess && (
        <div
          className="w-10 h-10 mb-2 bg-cover bg-center"
          style={{ backgroundImage: `url(${url})` }}
        ></div>
      )}

      <select
        className="block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 p-2"
        style={{ width: isImageLess ? "150px" : "400px" }}
        value={selectedOption.value}
        onChange={(e) => {
          const selected = options.find(
            (option) => option.value === e.target.value
          );
          setSelectedOption(selected);
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};
