import { useState } from "react";
import Input from "../../../shared/InputField";

// ButtonGroup Component
export const ButtonGroup = ({
  options,
  onChange,
  label,
  className = "",
  value,
}) => (
  <div className="mb-5">
    {label && (
      <label className="block py-1 font-semibold text-sm">{label}</label>
    )}
    <ul className="flex gap-1">
      {options.map((option) => (
        <li
          className={`${className} ${
            option.style
          } bg-white flex justify-center items-center py-2 px-2.5 border text-lg cursor-pointer ${
            value === option.value ? "border-[#205fa8]" : "border-[#e1e1e1]"
          }`}
          key={option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  </div>
);

const symbols = [
  { value: "heart", label: "♡", description: "» .description" },
  { value: "double-heart", label: "♡♡", description: "¾ .description" },
  { value: "double-ring", label: `○○`, description: "¼ .description" },
  { value: "infinity", label: "∞", description: "½ .description" },
];

const TabContent = ({ isPair, engravingText, setEngravingText, fonts }) => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedFont, setSelectedFont] = useState("svnfont00");

  const handleInputChange = (value) => {
    setEngravingText(value);
  };

  const handleSymbolSelect = (symbolVal) => {
    setSelectedSymbol(symbolVal);
    const selectedSymbolObj = symbols.find(
      (symbol) => symbol.value === symbolVal
    );

    const symbolLabel = selectedSymbolObj ? selectedSymbolObj.label : "";

    setEngravingText((prev) => `${prev}${symbolLabel}`);
  };


  console.log(selectedSymbol);
  console.log(selectedFont);

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      <div>
        <label className="block py-1 font-semibold text-sm">
          Engraving text Ring 1
        </label>
        <Input
          type="text"
          placeholder=""
          value={engravingText}
          onChange={(e) => handleInputChange(e.target.value)}
          maxLength={35}
        />
        <div className="text-right text-[#bdbdbd] text-sm">
          {35 - engravingText.length}
        </div>
      </div>

      {(isPair.pair1 || isPair.pair2) && (
        <div>
          <label className="block py-1 font-semibold text-sm">
            Engraving text Ring 2
          </label>
          <Input
            type="text"
            placeholder=""
            value={engravingText}
            onChange={(e) => handleInputChange(e.target.value)}
            maxLength={35}
          />
          <div className="text-right text-[#bdbdbd] text-sm">
            {35 - engravingText.length}
          </div>
        </div>
      )}

      <ButtonGroup
        options={symbols}
        value={selectedSymbol}
        onChange={handleSymbolSelect}
        label="Add symbol"
        className="w-14"
      />
      <ButtonGroup
        options={fonts}
        value={selectedFont}
        onChange={setSelectedFont}
        label="Font"
      />
    </div>
  );
};

export default TabContent;
