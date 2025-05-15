import { useState, useEffect } from "react";
import WidthDepthSurface from "./WidthDepthSurface";
import { TrashSvg, AddSvg } from "../../../../static/SvgImages";
import { GrooveRangeSlider } from "../../../shared/GrooveRangeSlider";
import { useLocalization } from "../../../../context/LocalizationContext";

const DistributionOptions = [
  {
    name: "Without",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/none.svg",
  },
  {
    name: "V-groove",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/v-groove-90.svg",
  },
  {
    name: "U-groove",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/u-groove.svg",
  },
  {
    name: "Corner joint",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/square-groove.svg",
  },
  {
    name: "Milgrain",
    img: "https://ui.cdn.confmetrix.com/auronia/production/12.3.5/images/auronia/groove/form/perlage.svg",
  },
];

const StepGroove = ({
  activeRing,
  selectedGrooveOptions,
  setSelectedGrooveOptions,
}) => {
  const { t } = useLocalization();
  
  // Helper function to generate storage key based on active ring
  const getStorageKey = (suffix) => {
    return Array.isArray(activeRing) 
      ? `${suffix}_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `${suffix}_${activeRing?.name}`;
  };

  // Initialize groove from localStorage or default to "Without"
  const [groove, setGroove] = useState(() => {
    const storageKey = getStorageKey('groove');
    return localStorage.getItem(storageKey) || "Without";
  });

  // Initialize subActiveTab from localStorage or default to "choice_of_groove"
  const [subActiveTab, setSubActiveTab] = useState(() => {
    const storageKey = getStorageKey('grooveSubTab');
    return localStorage.getItem(storageKey) || "choice_of_groove";
  });

  // Initialize ring1Grooves from localStorage or default
  const [ring1Grooves, setRing1Grooves] = useState(() => {
    const storageKey = getStorageKey('ring1Grooves');
    const savedGrooves = localStorage.getItem(storageKey);
    return savedGrooves ? JSON.parse(savedGrooves) : [
      { id: 1, name: t('grooveAndEdge.labels.freeGroove') },
    ];
  });

  // Initialize ring2Grooves from localStorage or default
  const [ring2Grooves, setRing2Grooves] = useState(() => {
    const storageKey = getStorageKey('ring2Grooves');
    const savedGrooves = localStorage.getItem(storageKey);
    return savedGrooves ? JSON.parse(savedGrooves) : [
      { id: 1, name: t('grooveAndEdge.labels.freeGroove') },
    ];
  });

  // Effect to reload states when activeRing changes
  useEffect(() => {
    // Load groove setting
    const grooveKey = getStorageKey('groove');
    const savedGroove = localStorage.getItem(grooveKey);
    if (savedGroove) setGroove(savedGroove);
    
    // Load subActiveTab
    const subTabKey = getStorageKey('grooveSubTab');
    const savedSubTab = localStorage.getItem(subTabKey);
    if (savedSubTab) setSubActiveTab(savedSubTab);
    
    // Load ring1Grooves
    const ring1Key = getStorageKey('ring1Grooves');
    const savedRing1 = localStorage.getItem(ring1Key);
    if (savedRing1) setRing1Grooves(JSON.parse(savedRing1));
    
    // Load ring2Grooves
    const ring2Key = getStorageKey('ring2Grooves');
    const savedRing2 = localStorage.getItem(ring2Key);
    if (savedRing2) setRing2Grooves(JSON.parse(savedRing2));
  }, [activeRing]);

  // Save groove to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('groove');
    localStorage.setItem(storageKey, groove);
  }, [groove, activeRing]);

  // Save subActiveTab to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('grooveSubTab');
    localStorage.setItem(storageKey, subActiveTab);
  }, [subActiveTab, activeRing]);

  // Save ring1Grooves to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('ring1Grooves');
    localStorage.setItem(storageKey, JSON.stringify(ring1Grooves));
  }, [ring1Grooves, activeRing]);

  // Save ring2Grooves to localStorage when it changes
  useEffect(() => {
    const storageKey = getStorageKey('ring2Grooves');
    localStorage.setItem(storageKey, JSON.stringify(ring2Grooves));
  }, [ring2Grooves, activeRing]);

  const handleGrooveSelection = (item) => {
    setGroove(item.name);
    window.parent.postMessage({ 
      action: 'addGroove', 
      type: item.name,
      ringKey: Array.isArray(activeRing) 
        ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
        : activeRing?.name
    }, "*");
  };

  const addGrooveRing1 = () => {
    const newId = ring1Grooves.length + 1;
    setRing1Grooves([...ring1Grooves, { id: newId, name: t('grooveAndEdge.labels.freeGroove') }]);
    window.parent.postMessage(
      { 
        action: "addGroove", 
        value: newId, 
        type: "defaultAdd", 
        selectedRing: "Ring 1",
        ringKey: Array.isArray(activeRing) 
          ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
          : activeRing?.name
      },
      "*"
    );
  };

  const addGrooveRing2 = () => {
    const newId = ring2Grooves.length + 1;
    setRing2Grooves([...ring2Grooves, { id: newId, name: t('grooveAndEdge.labels.freeGroove') }]);
    window.parent.postMessage(
      { 
        action: "addGroove", 
        value: newId, 
        type: "defaultAdd", 
        selectedRing: "Ring 2",
        ringKey: Array.isArray(activeRing) 
          ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
          : activeRing?.name
      },
      "*"
    );
  };

  const removeGrooveRing1 = (id) => {
    setRing1Grooves(ring1Grooves.filter((groove) => groove.id !== id));
    window.parent.postMessage(
      { 
        action: "addGroove", 
        type: "defaultDelete", 
        selectedRing: "Ring 1",
        ringKey: Array.isArray(activeRing) 
          ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
          : activeRing?.name
      },
      "*"
    );
  };

  const removeGrooveRing2 = (id) => {
    setRing2Grooves(ring2Grooves.filter((groove) => groove.id !== id));
    window.parent.postMessage(
      { 
        action: "addGroove", 
        type: "defaultDelete", 
        selectedRing: "Ring 2",
        ringKey: Array.isArray(activeRing) 
          ? `${activeRing[0]?.name}_${activeRing[1]?.name}` 
          : activeRing?.name
      },
      "*"
    );
  };
  
  // Function to get localized groove name
  const getLocalizedGrooveName = (name) => {
    switch(name) {
      case "Without": return t('grooveAndEdge.options.without');
      case "V-groove": return t('grooveAndEdge.options.vGroove');
      case "U-groove": return t('grooveAndEdge.options.uGroove');
      case "Corner joint": return t('grooveAndEdge.options.cornerJoint');
      case "Milgrain": return t('grooveAndEdge.options.milgrain');
      default: return name;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto pt-5">
      {/* Tab buttons */}
      <div>
        <button
          className={`font-semibold mr-5 ${
            subActiveTab === "choice_of_groove"
              ? "text-[#205fa8ff] border-b border-[#205fa8ff]"
              : ""
          }`}
          onClick={() => setSubActiveTab("choice_of_groove")}
        >
          {t('grooveAndEdge.tabs.choiceOfGroove')}
        </button>
        {groove !== "Without" && (
          <button
            className={`font-semibold mr-5 ${
              subActiveTab === "position"
                ? "text-[#205fa8ff] border-b border-[#205fa8ff]"
                : ""
            }`}
            onClick={() => setSubActiveTab("position")}
          >
            {t('grooveAndEdge.tabs.position')}
          </button>
        )}
      </div>

      {/* Choice of groove tab content */}
      {subActiveTab === "choice_of_groove" && (
        <div className="mt-5">
          <label className="text-sm block font-semibold py-1">
            {t('grooveAndEdge.labels.choiceOfGroove')}
          </label>
          <div className="flex items-start space-x-2">
            {DistributionOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleGrooveSelection(item)}
                className={`bg-white w-full border ${
                  groove === item.name ? "border-[#205fa8]" : "border-[#e1e1e1]"
                }`}
              >
                <span className="text-sm">{getLocalizedGrooveName(item.name)}</span>
                <img src={item.img} className="mx-auto mt-5" alt={item.name} />
              </button>
            ))}
          </div>
          {groove !== "Without" && (
            <WidthDepthSurface
              groove={groove}
              selectedOptions={selectedGrooveOptions}
              setSelectedOptions={setSelectedGrooveOptions}
              activeRing={activeRing}
            />
          )}
        </div>
      )}

      {/* Position tab content */}
      {subActiveTab === "position" && (
        <div className="mt-5">
          <div className="flex flex-row space-x-4">
            {/* Ring 1 */}
            <div className={activeRing.type === "Wedding" ? "w-1/2" : "w-full"}>
              <label className="block font-semibold py-1">{t('grooveAndEdge.labels.ring1')}</label>
              {ring1Grooves.map((grooveItem) => (
                <div className="flex items-center mb-2.5" key={grooveItem.id}>
                  <span className="w-7 h-7 flex items-center justify-center">
                    {grooveItem.id}
                  </span>
                  <div className="border px-2.5 py-2 w-full flex items-center justify-between bg-white">
                    <span>{grooveItem.name}</span>
                    <TrashSvg
                      className="cursor-pointer"
                      onClick={() => removeGrooveRing1(grooveItem.id)}
                    />
                  </div>
                </div>
              ))}
              <div
                className="flex items-center ml-7 cursor-pointer"
                onClick={addGrooveRing1}
              >
                <div className="bg-white rounded-full mr-2 border border-[#e1e1e1] w-7 h-7 flex justify-center items-center">
                  <AddSvg />
                </div>
                <span className="text-sm">{t('grooveAndEdge.labels.addAnotherGroove')}</span>
              </div>
            </div>

            {/* Ring 2 */}
            {activeRing.type === "Wedding" && window.ringsLength === 2 && (
              <div className="w-1/2">
                <label className="block font-semibold py-1">{t('grooveAndEdge.labels.ring2')}</label>
                {ring2Grooves.map((grooveItem) => (
                  <div className="flex items-center mb-2.5" key={grooveItem.id}>
                    <span className="w-7 h-7 flex items-center justify-center">
                      {grooveItem.id}
                    </span>
                    <div className="border px-2.5 py-2 w-full flex items-center justify-between bg-white">
                      <span>{grooveItem.name}</span>
                      <TrashSvg
                        className="cursor-pointer"
                        onClick={() => removeGrooveRing2(grooveItem.id)}
                      />
                    </div>
                  </div>
                ))}
                <div
                  className="flex items-center ml-7 cursor-pointer"
                  onClick={addGrooveRing2}
                >
                  <div className="bg-white rounded-full mr-2 border border-[#e1e1e1] w-7 h-7 flex justify-center items-center">
                    <AddSvg />
                  </div>
                  <span className="text-sm">{t('grooveAndEdge.labels.addAnotherGroove')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sliders */}
          <div className="mt-4">
            <GrooveRangeSlider
              title={t('grooveAndEdge.labels.ring1')}
              grooves={ring1Grooves}
              min={-0.85}
              max={-0.55}
              step={0.001}
              defaultValue={-0.7}
              activeRing={activeRing}
            />
          </div>
          {activeRing.type === "Wedding" && window.ringsLength === 2 && (
            <div className="mt-4">
              <GrooveRangeSlider
                title={t('grooveAndEdge.labels.ring2')}
                grooves={ring2Grooves}
                min={0.55}
                max={0.85}
                step={0.001}
                defaultValue={0.7}
                activeRing={activeRing}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepGroove;