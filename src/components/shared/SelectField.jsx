export const SelectField = ({ options, selectedOption, handleInputChange, id }) => {
  return (
    <select
      value={selectedOption.value}
      onChange={(e) =>
        handleInputChange(id, {
          name: options.find(opt => opt.value === e.target.value).name,
          value: e.target.value
        })
      }
      className="w-full border hover:border-[#909090] rounded px-2 py-3"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.name || option.value}
        </option>
      ))}
    </select>
  );
};
