import { useState } from "react";
// Button Component
export const Button = ({ children, onClick, className = "" }) => (
  <button className={`btn ${className}`} onClick={onClick}>
    {children}
  </button>
);

// ButtonGroup Component
export const ButtonGroup = ({
  options,
  //   value,
  onChange,
  label,
  className = "",
}) => (
  <div className={` ${className}`}>
    {label && <label className="button-group-label">{label}</label>}
    <ul className="button-grid">
      {options.map((option) => (
        <li key={option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </li>
      ))}
    </ul>
  </div>
);

// Toggle Component
export const Toggle = ({ label, checked, onChange }) => (
  <div className="toggle">
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-slider"></span>
      {label}
    </label>
  </div>
);

// TextField Component
export const TextField = ({
  label,
  value,
  onChange,
  maxLength,
  className = "",
}) => (
  <div className={`textfield ${className}`}>
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
    />
    {maxLength && (
      <div className="textfield-remaining">{maxLength - value.length}</div>
    )}
  </div>
);
const EngravingOptions = ({isPair, toggleIsPair}) => {
  //   injectStyle(styles);
  const [engravingType, setEngravingType] = useState("laser");
  const [engravingText, setEngravingText] = useState("");
  const [selectedFont, setSelectedFont] = useState("svnfont00");
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const engravingTypes = [
    { value: "laser", label: "Laser engraving" },
    { value: "diamond", label: "Diamond engraving" },
  ];

  const symbols = [
    { value: "heart", label: "♡", description: "» .description" },
    { value: "double-heart", label: "♡♡", description: "¾ .description" },
    { value: "double-ring", label: `○○`, description: "¼ .description" },
    { value: "infinity", label: "∞", description: "½ .description" },
  ];

  const fonts = [
    { value: "svnfont00", label: "Abc 123" },
    { value: "svnfont01", label: "Abc 123" },
    { value: "svnfont02", label: "Abc 123" },
    { value: "svnfont03", label: "Abc 123" },
    { value: "svnfont04", label: "Abc 123" },
  ];

  const engravingOptions = [
    {
      value: "handwritten",
      label: "Handwriting",
      description:
        "Your handwriting can be engraved by laser on both the inside and outside of your rings. You will receive detailed information on the procedure once you place your order.",
    },
    {
      value: "fingerprint",
      label: "Fingerprint",
      description:
        "Your fingerprint can be engraved by laser on both the inside and outside of your rings. You will receive detailed information on the procedure once you place your order.",
    },
    {
      value: "graphic",
      label: "Graphics",
      description:
        "Your graphics can be engraved by laser on both the inside and outside of your rings. You will receive detailed information on the procedure once you place your order.",
    },
  ];

  return (
    <div className="engraving-spots enabled" style={{ margin: "20px 20px" }}>
      <div className="panel-top">
      <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
      >
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
        />
        <label  style={{ marginRight: "10px" }}>
          Use the same settings for both rings
        </label>
      </div>
        <ButtonGroup
          options={engravingTypes}
          value={engravingType[0]?.value}
          onChange={setEngravingType}
          className=""
        />
        <div className="engraving-text-settings">
          <div className={`engraving-text-select ${selectedFont}`}>
            <TextField
              label="Engraving text Ring 1"
              value={engravingText}
              onChange={setEngravingText}
              maxLength={35}
              className="engraving-text"
            />
          </div>
          <div className="engraving-dropdown-wrapper">
            <ButtonGroup
              options={symbols}
              value={selectedSymbol}
              onChange={setSelectedSymbol}
              label="Add symbol"
              className="engraving-symbols"
            />
            <ButtonGroup
              options={fonts}
              value={selectedFont}
              onChange={setSelectedFont}
              label="Font"
              className="engraving-fonts"
            />
          </div>
        </div>
        <div className="toggle-group engraving-options-selector">
          {engravingOptions.map((option) => (
            <div key={option.value} className={`option option-${option.value}`}>
              <Toggle label={option.label} />
              <span className="help-badge">
                <i className="svg-icon svg-icon-info-sm">
                  {/* Insert SVG icon here */}
                </i>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngravingOptions;
