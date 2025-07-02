import { useState, useEffect, useRef } from "react";
import Input from "../../../shared/InputField";
import { useLocalization } from "../../../../context/LocalizationContext";
import { saveEngravingText, loadEngravingText, saveEngravingSymbol, loadEngravingSymbol } from "../../../../utils/pricing";

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
  
  // Separate states for individual ring texts
  const [ring1Text, setRing1Text] = useState(() => loadEngravingText('ring1'));
  const [ring2Text, setRing2Text] = useState(() => loadEngravingText('ring2'));
  const [ring3Text, setRing3Text] = useState(() => loadEngravingText('ring3'));
  
  // Separate states for individual ring symbols
  const [ring1Symbol, setRing1Symbol] = useState(() => loadEngravingSymbol('ring1'));
  const [ring2Symbol, setRing2Symbol] = useState(() => loadEngravingSymbol('ring2'));
  const [ring3Symbol, setRing3Symbol] = useState(() => loadEngravingSymbol('ring3'));

  // Update local states when ring selection changes or localStorage changes
  useEffect(() => {
    const updateTextsAndSymbols = () => {
      setRing1Text(loadEngravingText('ring1'));
      setRing2Text(loadEngravingText('ring2'));
      setRing3Text(loadEngravingText('ring3'));
      setRing1Symbol(loadEngravingSymbol('ring1'));
      setRing2Symbol(loadEngravingSymbol('ring2'));
      setRing3Symbol(loadEngravingSymbol('ring3'));
    };

    // Listen for storage changes
    window.addEventListener('storage', updateTextsAndSymbols);
    window.addEventListener('engravingPricingChanged', updateTextsAndSymbols);

    return () => {
      window.removeEventListener('storage', updateTextsAndSymbols);
      window.removeEventListener('engravingPricingChanged', updateTextsAndSymbols);
    };
  }, []);

  // Updated handleInputChange function for selected ring
  const handleInputChange = (value) => {
    const selectedRing = window.selectedRing || 1; // Default to ring 1 if not set
    const ringKey = `ring${selectedRing}`;
    
    // Update the appropriate ring state
    if (ringKey === 'ring1') {
      setRing1Text(value);
    } else if (ringKey === 'ring2') {
      setRing2Text(value);
    } else if (ringKey === 'ring3') {
      setRing3Text(value);
    }

    // Check if it's a pair and apply to both rings
    const isPairActive = window.pair1 === true;
    
    if (isPairActive && (ringKey === 'ring1' || ringKey === 'ring2')) {
      // For pairs, apply text to both rings
      setRing1Text(value);
      setRing2Text(value);
      saveEngravingText('ring1', value);
      saveEngravingText('ring2', value);
    } else {
      // For individual rings, save only to the selected ring
      saveEngravingText(ringKey, value);
    }

    // Clear any previously set timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to log after 2 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      console.log(`Final Engraving Text for ${ringKey}: ${value}`);
      window.parent.postMessage(
        { action: "EngraveText", ringKey, isEngraving: value, isPair: isPairActive },
        "*"
      );
    }, 2000); // 2-second delay
  };

  // Updated handleSymbolSelect function - now replaces existing symbol
  const handleSymbolSelect = (symbolVal) => {
    const selectedRing = window.selectedRing || 1; // Default to ring 1 if not set
    const ringKey = `ring${selectedRing}`;
    
    setSelectedSymbol(symbolVal);
    const selectedSymbolObj = symbols.find(
      (symbol) => symbol.value === symbolVal
    );

    const symbolLabel = selectedSymbolObj ? selectedSymbolObj.label : "";
    const isPairActive = window.pair1 === true;

    if (isPairActive && (ringKey === 'ring1' || ringKey === 'ring2')) {
      // For pairs, apply symbol to both rings (replace existing symbol)
      setRing1Symbol(symbolLabel);
      setRing2Symbol(symbolLabel);
      saveEngravingSymbol('ring1', symbolLabel);
      saveEngravingSymbol('ring2', symbolLabel);
    } else {
      // For individual rings, apply only to the selected ring (replace existing symbol)
      if (ringKey === 'ring1') {
        setRing1Symbol(symbolLabel);
        saveEngravingSymbol('ring1', symbolLabel);
      } else if (ringKey === 'ring2') {
        setRing2Symbol(symbolLabel);
        saveEngravingSymbol('ring2', symbolLabel);
      } else if (ringKey === 'ring3') {
        setRing3Symbol(symbolLabel);
        saveEngravingSymbol('ring3', symbolLabel);
      }
    }

    console.log(`Engraved Symbol Set for ${ringKey}: ${symbolLabel}`);
    window.parent.postMessage(
      { action: "EngraveSymbol", ringKey, value: selectedSymbolObj, isPair: isPairActive },
      "*"
    );
  };

  // Get current selected ring info
  const selectedRing = window.selectedRing || 1;
  const isPairActive = window.pair1 === true;
  
  // Get the current text for the selected ring
  const getCurrentText = () => {
    if (selectedRing === 1) return ring1Text;
    if (selectedRing === 2) return ring2Text;
    if (selectedRing === 3) return ring3Text;
    return '';
  };

  // Get the current symbol for the selected ring
  const getCurrentSymbol = () => {
    if (selectedRing === 1) return ring1Symbol;
    if (selectedRing === 2) return ring2Symbol;
    if (selectedRing === 3) return ring3Symbol;
    return '';
  };

  // Get the symbol value that matches the current symbol label
  const getCurrentSymbolValue = () => {
    const currentSymbol = getCurrentSymbol();
    if (!currentSymbol) return '';
    
    const symbolObj = symbols.find(symbol => symbol.label === currentSymbol);
    return symbolObj ? symbolObj.value : '';
  };

  const currentText = getCurrentText();
  const currentSymbolValue = getCurrentSymbolValue();

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      <div>
        <label className="block py-1 font-semibold text-sm">
          {isPairActive ? 
            `${t('engraving.textLabels.ring1')} & ${t('engraving.textLabels.ring2')}` : 
            `${t('engraving.textLabels.ring1').replace('1', selectedRing)}`
          }
        </label>
        <Input
          type="text"
          placeholder=""
          value={currentText}
          onChange={(e) => handleInputChange(e.target.value)}
          maxLength={15}
        />
        <div className="text-right text-[#bdbdbd] text-sm">
          {35 - currentText.length}
        </div>
      </div>

      <ButtonGroup
        options={symbols}
        value={currentSymbolValue}
        onChange={handleSymbolSelect}
        label={t('engraving.textLabels.addSymbol')}
        className="w-14"
      />
      
      {/* {getCurrentSymbol() && (
        <div className="flex items-center justify-between mt-2 p-2 bg-gray-100 rounded">
          <span className="text-sm">Current symbol: {getCurrentSymbol()}</span>
          <button
            onClick={() => {
              const selectedRing = window.selectedRing || 1;
              const ringKey = `ring${selectedRing}`;
              const isPairActive = window.pair1 === true;
              
              if (isPairActive && (ringKey === 'ring1' || ringKey === 'ring2')) {
                setRing1Symbol('');
                setRing2Symbol('');
                saveEngravingSymbol('ring1', '');
                saveEngravingSymbol('ring2', '');
              } else {
                if (ringKey === 'ring1') {
                  setRing1Symbol('');
                  saveEngravingSymbol('ring1', '');
                } else if (ringKey === 'ring2') {
                  setRing2Symbol('');
                  saveEngravingSymbol('ring2', '');
                } else if (ringKey === 'ring3') {
                  setRing3Symbol('');
                  saveEngravingSymbol('ring3', '');
                }
              }
              setSelectedSymbol('');
            }}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      )} */}
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
