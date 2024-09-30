import { useState } from "react";

export const Stone = () => {
  const [selectedOption, setSelectedOption] = useState("One");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const containerStyle = {
    display: "block",
    position: "relative",
    paddingLeft: "35px",
    marginBottom: "12px",
    cursor: "pointer",
    fontSize: "22px",
    userSelect: "none",
  };

  const inputStyle = {
    position: "absolute",
    opacity: 0,
    cursor: "pointer",
  };

  const checkmarkStyle = (isChecked) => ({
    position: "absolute",
    top: 0,
    left: 0,
    height: "25px",
    width: "25px",
    backgroundColor: isChecked ? "#2196F3" : "#eee",
    borderRadius: "50%",
  });

  const checkmarkAfterStyle = {
    content: '""',
    position: "absolute",
    display: "block",
    top: "9px",
    left: "9px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "white",
  };

  const [option, setOption] = useState(1);

  return (
    <div style={{ margin: "20px 20px" }}>
      <div style={{ display: "flex", margin: "25px" }}>
        <button
          onClick={() => setOption(1)}
          className={`stone-setting ${option === 1 && "active-stone-setting"} `}
        >
          with stone setting
        </button>
        <br />
        <button
          onClick={() => setOption(2)}
          className={`stone-setting ${
            option === 2 && "active-stone-setting"
          } stone-setting`}
        >
          without stone setting
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "25px",
        }}
      >
        {option === 1 &&
          [
            `E / IF (Colourless+ / flawless)`,
            `G / VS (Near colourless / very slightly included)`,
            `G / SI (Near colourless / slightly included)`,
            `Cubic zirconia AAA (white / very good)`,
          ].map((option) => (
            <label key={option} style={containerStyle}>
              {option}
              <input
                type="radio"
                name="radio"
                value={option}
                checked={selectedOption === option}
                onChange={handleChange}
                style={inputStyle}
              />
              <span style={checkmarkStyle(selectedOption === option)}>
                {selectedOption === option && (
                  <span style={checkmarkAfterStyle} />
                )}
              </span>
            </label>
          ))}
      </div>
    </div>
  );
};
