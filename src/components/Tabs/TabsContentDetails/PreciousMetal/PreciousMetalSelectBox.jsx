import { useLocalization } from "../../../../context/LocalizationContext";

export const PreciousMetalSelectBox = ({
  options,
  setSelectedOption,
  selectedOption,
  isImageLess,
}) => {
  const { t } = useLocalization();
  
  // Fallback URL if none is provided for an option
  // const defaultUrl =
  //   "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/disc/color/585_rotgold.png";

  // Get URL from selected option, or use default
  // const url = selectedOption?.url || defaultUrl;

  const handleChange = (e) => {
    const selected = options?.find(
      (option) => option.value === e.target.value
    );
    setSelectedOption(selected);
  };

  return (
    <div className="relative flex items-center mb-3">
      {!isImageLess && (
        <div
          className={`w-10 h-10 bg-cover bg-center `}
          // style={{ backgroundImage: `url(${url})` }}
          style={{ backgroundColor: `${selectedOption?.colorCode}` }}
        ></div>
      )}

      <select
        className="w-full border border-[#909090] px-3 py-2 flex-1"
        // style={{ width: isImageLess ? "150px" : "400px" }}
        value={selectedOption?.value || ''}
        onChange={handleChange}
      >
        {options?.map((option, index) => (
          <option key={index} value={option.value} className="flex items-center">
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};
