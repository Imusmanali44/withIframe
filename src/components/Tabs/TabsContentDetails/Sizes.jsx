import { useState, useEffect } from "react";
import { useLocalization } from "../../../context/LocalizationContext";
import { saveSizePricing } from "../../../utils/pricing";

export const Sizes = ({ rings, activeRing }) => {
  const { t } = useLocalization();
  const [isRing1Auto, setIsRing1Auto] = useState(false);
  const [isRing2Auto, setIsRing2Auto] = useState(false);
  const [ring1Width, setRing1Width] = useState("4,50 mm");
  const [ring1Thickness, setRing1Thickness] = useState("1,70 mm");
  const [ring1SizeCountry, setRing1SizeCountry] = useState("EU");
  const [ring1Size, setRing1Size] = useState("62");
  const [ring2Width, setRing2Width] = useState("3,50 mm");
  const [ring2Thickness, setRing2Thickness] = useState("1,70 mm");
  const [ring2SizeCountry, setRing2SizeCountry] = useState("EU");
  const [ring2Size, setRing2Size] = useState("56");

  // Generate storage keys based on active ring
  const getStorageKey = (prefix) => {
    if (Array.isArray(activeRing)) {
      return `${prefix}_${activeRing[0]?.name}_${activeRing[1]?.name}`;
    }
    return `${prefix}_${activeRing?.name}`;
  };

  // Update pricing for a specific ring
  const updateRingPricing = (ringKey, values) => {
    saveSizePricing(ringKey, values);
  };

  // Check if we're in pair mode
  const isPairMode = Array.isArray(activeRing) && activeRing[0]?.type === "Wedding";

  // Determine which ring we're working with in single mode
  const getCurrentRingKey = () => {
    if (isPairMode) return null; // Not applicable in pair mode
    
    // Check if activeRing has an id or name that indicates ring 2
    if (activeRing?.id === 2 || activeRing?.name?.toLowerCase().includes('ring 2') || activeRing?.name?.includes('2')) {
      return 'ring2';
    }
    return 'ring1'; // Default to ring1
  };

  // Update pricing for both rings or individual ring
  const updatePricing = () => {
    // Only save/update pricing if user has actually made changes
    // Check if current values differ from defaults
    const hasRing1Changes = ring1Width !== "4,50 mm" || ring1Thickness !== "1,70 mm" || ring1Size !== "62" || ring1SizeCountry !== "EU" || isRing1Auto !== false;
    const hasRing2Changes = ring2Width !== "3,50 mm" || ring2Thickness !== "1,70 mm" || ring2Size !== "56" || ring2SizeCountry !== "EU" || isRing2Auto !== false;
    
    if (isPairMode) {
      // Update both rings in pair mode
      if (hasRing1Changes) {
        updateRingPricing('ring1', {
          width: ring1Width,
          thickness: ring1Thickness,
          size: ring1Size,
          sizeCountry: ring1SizeCountry,
          isAuto: isRing1Auto
        });
      }
      
      if (hasRing2Changes) {
        updateRingPricing('ring2', {
          width: ring2Width,
          thickness: ring2Thickness,
          size: ring2Size,
          sizeCountry: ring2SizeCountry,
          isAuto: isRing2Auto
        });
      }
    } else {
      // Update individual ring only
      const currentRingKey = getCurrentRingKey();
      
      if (currentRingKey === 'ring2' && hasRing2Changes) {
        updateRingPricing('ring2', {
          width: ring2Width,
          thickness: ring2Thickness,
          size: ring2Size,
          sizeCountry: ring2SizeCountry,
          isAuto: isRing2Auto
        });
      } else if (currentRingKey !== 'ring2' && hasRing1Changes) {
        updateRingPricing('ring1', {
          width: ring1Width,
          thickness: ring1Thickness,
          size: ring1Size,
          sizeCountry: ring1SizeCountry,
          isAuto: isRing1Auto
        });
      }
    }
  };

  // Load saved values from localStorage on component mount
  useEffect(() => {
    // Load auto settings
    const savedRing1Auto = localStorage.getItem(getStorageKey("ring1Auto"));
    const savedRing2Auto = localStorage.getItem(getStorageKey("ring2Auto"));
    
    if (savedRing1Auto !== null) {
      setIsRing1Auto(savedRing1Auto === "true");
    }
    
    if (savedRing2Auto !== null) {
      setIsRing2Auto(savedRing2Auto === "true");
    }
    
    // Load ring 1 dimensions
    const savedRing1Width = localStorage.getItem(getStorageKey("ring1Width"));
    const savedRing1Thickness = localStorage.getItem(getStorageKey("ring1Thickness"));
    const savedRing1SizeCountry = localStorage.getItem(getStorageKey("ring1SizeCountry"));
    const savedRing1Size = localStorage.getItem(getStorageKey("ring1Size"));
    
    if (savedRing1Width) setRing1Width(savedRing1Width);
    if (savedRing1Thickness) setRing1Thickness(savedRing1Thickness);
    if (savedRing1SizeCountry) setRing1SizeCountry(savedRing1SizeCountry);
    if (savedRing1Size) setRing1Size(savedRing1Size);
    
    // Load ring 2 dimensions
    const savedRing2Width = localStorage.getItem(getStorageKey("ring2Width"));
    const savedRing2Thickness = localStorage.getItem(getStorageKey("ring2Thickness"));
    const savedRing2SizeCountry = localStorage.getItem(getStorageKey("ring2SizeCountry"));
    const savedRing2Size = localStorage.getItem(getStorageKey("ring2Size"));
    
    if (savedRing2Width) setRing2Width(savedRing2Width);
    if (savedRing2Thickness) setRing2Thickness(savedRing2Thickness);
    if (savedRing2SizeCountry) setRing2SizeCountry(savedRing2SizeCountry);
    if (savedRing2Size) setRing2Size(savedRing2Size);
    
    // Send initial values to parent if they exist
    if (savedRing1Width) {
      // window.parent.postMessage({ 
      //   action: 'changeWidth', 
      //   selectedRing: activeRing, 
      //   value: savedRing1Width 
      // }, "*");
    }
    
    if (savedRing1Thickness) {
      // window.parent.postMessage({ 
      //   action: 'changeHeight', 
      //   selectedRing: activeRing, 
      //   value: savedRing1Thickness 
      // }, "*");
    }
  }, [activeRing]);

  // Update pricing whenever values change
  useEffect(() => {
    updatePricing();
  }, [ring1Width, ring1Thickness, ring1Size, ring1SizeCountry, isRing1Auto, 
      ring2Width, ring2Thickness, ring2Size, ring2SizeCountry, isRing2Auto]);

  const handleRing1WidthChange = (e) => {
    const value = e.target.value;
    setRing1Width(value);
    localStorage.setItem(getStorageKey("ring1Width"), value);
    
    console.log(`Ring 1 Width selected: ${value}`);
    window.parent.postMessage({ action: 'changeWidth', selectedRing: activeRing, value: value }, "*");
  };

  const handleRing1ThicknessChange = (e) => {
    const value = e.target.value;
    setRing1Thickness(value);
    localStorage.setItem(getStorageKey("ring1Thickness"), value);
    
    console.log(`Ring 1 Thickness selected: ${value}`);
    window.parent.postMessage({ action: 'changeHeight', selectedRing: activeRing, value: value }, "*");
  };

  const handleRing1SizeChange = (e, type = "size") => {
    const value = e.target.value;
    
    if (type === "country") {
      setRing1SizeCountry(value);
      localStorage.setItem(getStorageKey("ring1SizeCountry"), value);
    } else {
      setRing1Size(value);
      localStorage.setItem(getStorageKey("ring1Size"), value);
      
      console.log(`Ring 1 Size selected: ${value}`);
      window.parent.postMessage(
        { action: 'countrySize', selectedRing: activeRing, value: value },
        "*"
      );
    }
  };

  const handleRing2WidthChange = (e) => {
    const value = e.target.value;
    setRing2Width(value);
    localStorage.setItem(getStorageKey("ring2Width"), value);
    
    console.log(`Ring 2 Width selected: ${value}`);
    window.parent.postMessage({ 
      action: 'changeWidth', 
      selectedRing: Array.isArray(activeRing) ? activeRing[1] : activeRing, 
      value: value 
    }, "*");
  };

  const handleRing2ThicknessChange = (e) => {
    const value = e.target.value;
    setRing2Thickness(value);
    localStorage.setItem(getStorageKey("ring2Thickness"), value);
    
    console.log(`Ring 2 Thickness selected: ${value}`);
    window.parent.postMessage({ 
      action: 'changeHeight', 
      selectedRing: Array.isArray(activeRing) ? activeRing[1] : activeRing, 
      value: value 
    }, "*");
  };

  const handleRing2SizeChange = (e, type = "size") => {
    const value = e.target.value;
    
    if (type === "country") {
      setRing2SizeCountry(value);
      localStorage.setItem(getStorageKey("ring2SizeCountry"), value);
    } else {
      setRing2Size(value);
      localStorage.setItem(getStorageKey("ring2Size"), value);
      
      console.log(`Ring 2 Size selected: ${value}`);
      window.parent.postMessage(
        { action: 'countrySize', selectedRing: Array.isArray(activeRing) ? activeRing[1] : activeRing, value: value },
        "*"
      );
    }
  };

  console.log("Active Ring(s):", activeRing);
  console.log("rings", rings);
  console.log("isPairMode:", isPairMode);
  console.log("getCurrentRingKey():", getCurrentRingKey());
  const thicknessOptions = [
    "1,20 mm", "1,30 mm", "1,40 mm", "1,50 mm", "1,60 mm",
    "1,70 mm", "1,80 mm", "1,90 mm", "2,00 mm", "2,10 mm",
    "2,20 mm", "2,30 mm"
  ];

  // Width options including decimal values
  const widthOptions = [
    "1,00 mm", "1,50 mm", "2,00 mm", "2,50 mm", "3,00 mm", "3,50 mm",
    "4,00 mm", "4,50 mm", "5,00 mm", "5,50 mm", "6,00 mm", "6,50 mm",
    "7,00 mm", "7,50 mm", "8,00 mm", "8,50 mm", "9,00 mm", "9,50 mm",
    "10,00 mm", "10,50 mm", "11,00 mm", "11,50 mm", "12,00 mm"
  ];

  // Ring size options based on country
  const getRingSizeOptions = (country) => {
    switch (country) {
      case "EU":
        return [
          "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
          "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70"
        ];
      case "UK":
        return ["F", "F½", "G", "G½", "H", "H½", "I", "I½", "J", "J½"];
      case "US":
        return ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"];
      case "ES":
      case "PL":
        return [
          "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
          "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70"
        ];
      default:
        return ["F", "F½", "G", "G½", "H", "H½", "I", "I½", "J", "J½"];
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between w-full max-w-[500px] mx-auto px-3 py-5 gap-5 mb-auto">
      {Array.isArray(activeRing) && activeRing[0]?.type === "Wedding" ? (
        <>
          <div className="lg:w-1/2 lg:ml-12">
            <h3 className="mb-3 font-semibold text-sm">{activeRing[0].name}</h3>
            <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-3">
              <div className="w-1/2 lg:w-auto mb-3 ring-width-1-before relative">
                <label className="block mb-1 font-semibold text-sm">
                  {t('sizes.ringWidth')}
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  value={ring1Width}
                  onChange={handleRing1WidthChange}
                >
                  {widthOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2 lg:w-auto mb-4 ring-width-2-before relative">
                <label className="block mb-1 font-semibold text-sm">
                  {t('sizes.ringThickness')}
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  disabled={isRing1Auto}
                  value={ring1Thickness}
                  onChange={handleRing1ThicknessChange}
                >
                  {thicknessOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={isRing1Auto}
                onChange={() => {
                  const newValue = !isRing1Auto;
                  setIsRing1Auto(newValue);
                  localStorage.setItem(getStorageKey("ring1Auto"), newValue.toString());
                  
                  console.log(
                    newValue
                      ? "Automatically set the optimal thickness is checked"
                      : "Automatically set the optimal thickness is unchecked"
                  );
                  
                  window.parent.postMessage(
                    { action: 'optimalHeight', value: newValue },
                    "*"
                  );
                }}
              />
              <label className="font-semibold text-sm">
                {t('sizes.autoThickness')}
              </label>
            </div>

            <div className="ring-width-3-before relative">
              <label className="block mb-1 font-semibold text-sm">
                {t('sizes.ringSize')}
              </label>
              <div className="flex">
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  value={ring1SizeCountry}
                  onChange={(e) => handleRing1SizeChange(e, "country")}
                >
                  <option value="EU">{t('sizes.country.eu') || 'EU'}</option>
                  <option value="UK">{t('sizes.country.uk')}</option>
                  <option value="ES">{t('sizes.country.es')}</option>
                  <option value="PL">{t('sizes.country.pl')}</option>
                  <option value="US">{t('sizes.country.us')}</option>
                </select>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  value={ring1Size}
                  onChange={(e) => handleRing1SizeChange(e)}
                >
                  {getRingSizeOptions(ring1SizeCountry).map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h3 className="mb-3 font-semibold text-sm">{activeRing[1].name}</h3>
            <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-3">
              <div className="w-1/2 lg:w-auto mb-3">
                <label className="block mb-1 font-semibold text-sm">
                  {t('sizes.ringWidth')}
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  value={ring2Width}
                  onChange={handleRing2WidthChange}
                >
                  {widthOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2 lg:w-auto mb-4">
                <label className="block mb-1 font-semibold text-sm">
                  {t('sizes.ringThickness')}
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  disabled={isRing2Auto}
                  value={ring2Thickness}
                  onChange={handleRing2ThicknessChange}
                >
                  {thicknessOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={isRing2Auto}
                onChange={() => {
                  const newValue = !isRing2Auto;
                  setIsRing2Auto(newValue);
                  localStorage.setItem(getStorageKey("ring2Auto"), newValue.toString());
                  
                  window.parent.postMessage(
                    { action: 'optimalHeight', selectedRing: activeRing[1], value: newValue },
                    "*"
                  );
                }}
              />
              <label className="font-semibold text-sm">
                {t('sizes.autoThickness')}
              </label>
            </div>

            <div className="relative">
              <label className="block mb-1 font-semibold text-sm">
                {t('sizes.ringSize')}
              </label>
              <div className="flex">
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  value={ring2SizeCountry}
                  onChange={(e) => handleRing2SizeChange(e, "country")}
                >
                  <option value="EU">{t('sizes.country.eu') || 'EU'}</option>
                  <option value="UK">{t('sizes.country.uk')}</option>
                  <option value="ES">{t('sizes.country.es')}</option>
                  <option value="PL">{t('sizes.country.pl')}</option>
                  <option value="US">{t('sizes.country.us')}</option>
                </select>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  value={ring2Size}
                  onChange={(e) => handleRing2SizeChange(e)}
                >
                  {getRingSizeOptions(ring2SizeCountry).map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="lg:ml-12 w-full">
          <h3 className="mb-3 font-semibold text-sm">{activeRing.name}</h3>
          {activeRing?.type === "Wedding" && (() => {
            const currentRingKey = getCurrentRingKey();
            const isRing2 = currentRingKey === 'ring2';
            
            return (
              <>
                <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-0">
                  <div className="w-1/2 lg:w-auto mb-3 ring-width-1-before relative">
                    <label className="block mb-1 font-semibold text-sm">
                      {t('sizes.ringWidth')}
                    </label>
                    <select
                      className="w-full border hover:border-[#909090] rounded px-2 py-3"
                      value={isRing2 ? ring2Width : ring1Width}
                      onChange={isRing2 ? handleRing2WidthChange : handleRing1WidthChange}
                    >
                      {widthOptions.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/2 lg:w-auto mb-3 ring-width-2-before relative">
                    <label className="block mb-1 font-semibold text-sm">
                      {t('sizes.ringThickness')}
                    </label>
                    <select
                      className="w-full border hover:border-[#909090] rounded px-2 py-3"
                      disabled={isRing2 ? isRing2Auto : isRing1Auto}
                      value={isRing2 ? ring2Thickness : ring1Thickness}
                      onChange={isRing2 ? handleRing2ThicknessChange : handleRing1ThicknessChange}
                    >
                      {thicknessOptions.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex mb-3 auto-setting">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={isRing2 ? isRing2Auto : isRing1Auto}
                    onChange={() => {
                      if (isRing2) {
                        const newValue = !isRing2Auto;
                        setIsRing2Auto(newValue);
                        localStorage.setItem(getStorageKey("ring2Auto"), newValue.toString());

                        console.log(
                          newValue
                            ? "Ring 2: Automatically set the optimal thickness is checked"
                            : "Ring 2: Automatically set the optimal thickness is unchecked"
                        );

                        window.parent.postMessage(
                          { action: 'optimalHeight', value: newValue },
                          "*"
                        );
                      } else {
                        const newValue = !isRing1Auto;
                        setIsRing1Auto(newValue);
                        localStorage.setItem(getStorageKey("ring1Auto"), newValue.toString());

                        console.log(
                          newValue
                            ? "Ring 1: Automatically set the optimal thickness is checked"
                            : "Ring 1: Automatically set the optimal thickness is unchecked"
                        );

                        window.parent.postMessage(
                          { action: 'optimalHeight', value: newValue },
                          "*"
                        );
                      }
                    }}
                  />
                  <label className="font-semibold text-sm">
                    {t('sizes.autoThickness')}
                  </label>
                </div>
              </>
            );
          })()}
          <div className="ring-width-3-before relative">
            <label className="block mb-1 font-semibold text-sm">
              {t('sizes.ringSize')}
            </label>
            <div className="flex">
              <select
                className="w-full border hover:border-[#909090] rounded px-2 py-3"
                value={getCurrentRingKey() === 'ring2' ? ring2SizeCountry : ring1SizeCountry}
                onChange={(e) => {
                  if (getCurrentRingKey() === 'ring2') {
                    handleRing2SizeChange(e, "country");
                  } else {
                    handleRing1SizeChange(e, "country");
                  }
                }}
              >
                <option value="EU">{t('sizes.country.eu') || 'EU'}</option>
                <option value="UK">{t('sizes.country.uk')}</option>
                <option value="ES">{t('sizes.country.es')}</option>
                <option value="PL">{t('sizes.country.pl')}</option>
                <option value="US">{t('sizes.country.us')}</option>
              </select>
              <select
                className="w-full border hover:border-[#909090] rounded px-2 py-3"
                value={getCurrentRingKey() === 'ring2' ? ring2Size : ring1Size}
                onChange={(e) => {
                  const value = e.target.value;
                  const currentRingKey = getCurrentRingKey();
                  
                  if (currentRingKey === 'ring2') {
                    setRing2Size(value);
                    localStorage.setItem(getStorageKey("ring2Size"), value);
                    
                    console.log(`Ring 2 Size selected: ${value}`);
                    window.parent.postMessage(
                      { action: 'countrySize', selectedRing: activeRing, value: value },
                      "*"
                    );
                  } else {
                    setRing1Size(value);
                    localStorage.setItem(getStorageKey("ring1Size"), value);
                    
                    console.log(`Ring 1 Size selected: ${value}`);
                    window.parent.postMessage(
                      { action: 'countrySize', selectedRing: activeRing, value: value },
                      "*"
                    );
                  }
                }}
              >
                {getRingSizeOptions(getCurrentRingKey() === 'ring2' ? ring2SizeCountry : ring1SizeCountry).map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};