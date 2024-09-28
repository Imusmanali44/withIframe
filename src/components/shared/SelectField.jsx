
const SelectField = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <select
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
      className="w-full border hover:border-[#909090] rounded px-2 py-3"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
