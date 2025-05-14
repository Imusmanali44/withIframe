import { useState, useEffect } from "react";
import { useLocalization } from "../../../context/LocalizationContext";

export const Sizes = ({ rings, activeRing }) => {
  const { t } = useLocalization();
  const [isRing1Auto, setIsRing1Auto] = useState(false);
  const [isRing2Auto, setIsRing2Auto] = useState(false);
  const [ring1Width, setRing1Width] = useState("");
  const [ring1Thickness, setRing1Thickness] = useState("");
  const [ring1SizeCountry, setRing1SizeCountry] = useState("UK");
  const [ring1Size, setRing1Size] = useState("");
  const [ring2Width, setRing2Width] = useState("");
  const [ring2Thickness, setRing2Thickness] = useState("");
  const [ring2SizeCountry, setRing2SizeCountry] = useState("UK");
  const [ring2Size, setRing2Size] = useState("");

  // Generate storage keys based on active ring
  const getStorageKey = (prefix) => {
    if (Array.isArray(activeRing)) {
      return `${prefix}_${activeRing[0]?.name}_${activeRing[1]?.name}`;
    }
    return `${prefix}_${activeRing?.name}`;
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
  console.log("rings", rings)
  const thicknessOptions = [
    "1,20 mm", "1,30 mm", "1,40 mm", "1,50 mm", "1,60 mm",
    "1,70 mm", "1,80 mm", "1,90 mm", "2,00 mm", "2,10 mm",
    "2,20 mm", "2,30 mm"
  ];

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
                  {!ring1Width && <option value="" disabled>{t('sizes.selectWidth')}</option>}
                  {[...Array(12)].map((_, i) => {
                    const size = i + 1;
                    return (
                      <option key={size} value={`${size},00 mm`}>
                        {`${size},00 mm`}
                      </option>
                    );
                  })}
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
                  {!ring1Thickness && <option value="" disabled>{t('sizes.selectThickness')}</option>}
                  {[...Array(12)].map((_, i) => {
                    const size = i + 1;
                    return (
                      <option key={size} value={`${size},00 mm`}>
                        {`${size},00 mm`}
                      </option>
                    );
                  })}
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
                  {!ring1Size && <option value="" disabled>{t('sizes.selectSize')}</option>}
                  <option value="F">F</option>
                  <option value="F½">F½</option>
                  <option value="G">G</option>
                  <option value="G½">G½</option>
                  <option value="H">H</option>
                  <option value="H½">H½</option>
                  <option value="I">I</option>
                  <option value="I½">I½</option>
                  <option value="J">J</option>
                  <option value="J½">J½</option>
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
                  {!ring2Width && <option value="" disabled>{t('sizes.selectWidth')}</option>}
                  {[...Array(12)].map((_, i) => {
                    const size = i + 1;
                    return (
                      <option key={size} value={`${size},00 mm`}>
                        {`${size},00 mm`}
                      </option>
                    );
                  })}
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
                  {!ring2Thickness && <option value="" disabled>{t('sizes.selectThickness')}</option>}
                  {[...Array(12)].map((_, i = 2) => {
                    const size = i + 1;
                    return (
                      <option key={size} value={`${size},00 mm`}>
                        {`${size},00 mm`}
                      </option>
                    );
                  })}
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
                  {!ring2Size && <option value="" disabled>{t('sizes.selectSize')}</option>}
                  <option value="F">F</option>
                  <option value="F½">F½</option>
                  <option value="G">G</option>
                  <option value="G½">G½</option>
                  <option value="H">H</option>
                  <option value="H½">H½</option>
                  <option value="I">I</option>
                  <option value="I½">I½</option>
                  <option value="J">J</option>
                  <option value="J½">J½</option>
                </select>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="lg:ml-12 w-full">
          <h3 className="mb-3 font-semibold text-sm">{activeRing.name}</h3>
          {activeRing?.type === "Wedding" && (
            <>
              <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-0">
                <div className="w-1/2 lg:w-auto mb-3 ring-width-1-before relative">
                  <label className="block mb-1 font-semibold text-sm">
                    {t('sizes.ringWidth')}
                  </label>
                  <select
                    className="w-full border hover:border-[#909090] rounded px-2 py-3"
                    value={ring1Width}
                    onChange={handleRing1WidthChange}
                  >
                    {!ring1Width && <option value="" disabled>{t('sizes.selectWidth')}</option>}
                    {[...Array(12)].map((_, i) => {
                      const size = i + 1;
                      return (
                        <option key={size} value={`${size},00 mm`}>
                          {`${size},00 mm`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="w-1/2 lg:w-auto mb-3 ring-width-2-before relative">
                  <label className="block mb-1 font-semibold text-sm">
                    {t('sizes.ringThickness')}
                  </label>
                  <select
                    className="w-full border hover:border-[#909090] rounded px-2 py-3"
                    disabled={isRing1Auto}
                    value={ring1Thickness}
                    onChange={handleRing1ThicknessChange}
                  >
                    {!ring1Thickness && <option value="" disabled>{t('sizes.selectThickness')}</option>}
                    {/* Custom options */}
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
                  checked={isRing1Auto}
                  onChange={() => {
                    const newValue = !isRing1Auto;
                    setIsRing1Auto(newValue);
                    localStorage.setItem(getStorageKey("ring1Auto"), newValue.toString());

                    // Log the state
                    console.log(
                      newValue
                        ? "Automatically set the optimal thickness is checked"
                        : "Automatically set the optimal thickness is unchecked"
                    );

                    // Send postMessage to iframe with the updated value
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
            </>
          )}
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
                <option value="UK">{t('sizes.country.uk')}</option>
                <option value="ES">{t('sizes.country.es')}</option>
                <option value="PL">{t('sizes.country.pl')}</option>
                <option value="US">{t('sizes.country.us')}</option>
              </select>
              <select
                className="w-full border hover:border-[#909090] rounded px-2 py-3"
                value={ring1Size}
                onChange={(e) => {
                  const value = e.target.value;
                  setRing1Size(value);
                  localStorage.setItem(getStorageKey("ring1Size"), value);
                  
                  console.log(`Ring Size (second select) selected: ${value}`);
                  window.parent.postMessage(
                    { action: 'countrySize', selectedRing: activeRing, value: value },
                    "*"
                  );
                }}
              >
                {!ring1Size && <option value="" disabled>{t('sizes.selectSize')}</option>}
                <option value="F">F</option>
                <option value="F½">F½</option>
                <option value="G">G</option>
                <option value="G½">G½</option>
                <option value="H">H</option>
                <option value="H½">H½</option>
                <option value="I">I</option>
                <option value="I½">I½</option>
                <option value="J">J</option>
                <option value="J½">J½</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};