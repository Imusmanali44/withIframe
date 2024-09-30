import { CloseSvg } from "../../../../static/SvgImages";
// Dropdown Component

export const Dropdown = ({
  title,
  setIsOpen,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="absolute bg-white shadow-lg border mt-1  w-full z-50 p-4 top-[80%]">
      <div className="head flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-black m-0">{title}</h3>
        <div onClick={() => setIsOpen(false)}>
          <CloseSvg width={15} height={15} onClick={() => setIsOpen(false)} />
        </div>
      </div>
      <ul className=" overflow-auto max-h-64 flex flex-wrap justify-start">
        {options.map((option, index) => (
          <li
            key={index}
            className={`w-[calc(32%-10px)] lg:w-[calc(25%-10px)] mx-1 mb-2 bg-white p-2 cursor-pointer hover:bg-gray-100 border text-center ${
              selectedOption?.label === option.label
                ? "border-[#205fa8]"
                : "border-[#e1e1e1]"
            }`}
            onClick={() => handleSelect(option)}
          >
            <span>{option.label}</span>

            {option.img && (
              <img
                src={option.img}
                className="mx-auto mt-5"
                alt={option.name}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
