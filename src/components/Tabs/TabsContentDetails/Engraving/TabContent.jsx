import { useState, useEffect, useRef } from "react";
import Input from "../../../shared/InputField";
import { useLocalization } from "../../../../context/LocalizationContext";

// ButtonGroup Component
export const ButtonGroup = ({
  options,
  onChange,
  label,
  className = "",
  value,
}) => {
  const { t } = useLocalization();
  
  return (
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
};

const TabContent = ({ isPair, engravingText, setEngravingText, fonts }) => {
  const { t } = useLocalization();
  
  const symbols = [
    { value: "heart", label: "♡", description: t('engraving.symbols.heart.description') },
    { value: "double-heart", label: "♡♡", description: t('engraving.symbols.doubleHeart.description') },
    { value: "double-ring", label: `○○`, description: t('engraving.symbols.doubleRing.description') },
    { value: "infinity", label: "∞", description: t('engraving.symbols.infinity.description') },
  ];
  
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedFont, setSelectedFont] = useState("svnfont00");
  const typingTimeoutRef = useRef(null);

  // Updated handleInputChange function
  const handleInputChange = (value) => {
    setEngravingText(value);

    // Clear any previously set timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to log after 2 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      console.log(`Final Engraving Text: ${value}`);
      window.parent.postMessage(
        { action: "EngraveText", isEngraving: value },
        "*"
      );
    }, 2000); // 2-second delay
  };

  // Updated handleSymbolSelect function
  const handleSymbolSelect = (symbolVal) => {
    setSelectedSymbol(symbolVal);
    const selectedSymbolObj = symbols.find(
      (symbol) => symbol.value === symbolVal
    );

    const symbolLabel = selectedSymbolObj ? selectedSymbolObj.label : "";

    // Append the symbol to the engraving text
    setEngravingText((prev) => {
      const newText = `${prev}${symbolLabel}`;
      console.log(`Engraved Symbol Added: ${newText}`);
      window.parent.postMessage(
        { action: "EngraveSymbol", value: selectedSymbolObj },
        "*"
      ); // Send message to Configurator
      return newText;
    });
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      <div>
        <label className="block py-1 font-semibold text-sm">
          {t('engraving.textLabels.ring1')}
        </label>
        <Input
          type="text"
          placeholder=""
          value={engravingText}
          onChange={(e) => handleInputChange(e.target.value)}
          maxLength={15}
        />
        <div className="text-right text-[#bdbdbd] text-sm">
          {35 - engravingText.length}
        </div>
      </div>

      {(isPair.pair1 || isPair.pair2) && (
        <div>
          <label className="block py-1 font-semibold text-sm">
            {t('engraving.textLabels.ring2')}
          </label>
          <Input
            type="text"
            placeholder=""
            value={engravingText}
            onChange={(e) => handleInputChange(e.target.value)}
            maxLength={15}
          />
          <div className="text-right text-[#bdbdbd] text-sm">
            {35 - engravingText.length}
          </div>
        </div>
      )}
      {(window.ringsLength == 3) && (
        <div>
          <label className="block py-1 font-semibold text-sm">
            {t('engraving.textLabels.ring3')}
          </label>
          <Input
            type="text"
            placeholder=""
            value={engravingText}
            onChange={(e) => handleInputChange(e.target.value)}
            maxLength={15}
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
        label={t('engraving.textLabels.addSymbol')}
        className="w-14"
      />
      <ButtonGroup
        options={fonts}
        value={selectedFont}
        onChange={(font) => {
          console.log(`Font changed to: ${font}`);
          setSelectedFont(font);
          setEngravingText("");
          window.parent.postMessage(
            { action: "FontChange", value: font },
            "*"
          );
        }}
        label={t('engraving.textLabels.font')}
      />
    </div>
  );
};

export default TabContent;
