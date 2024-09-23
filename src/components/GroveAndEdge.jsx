import { useState } from "react";
import { DropDown } from "./DropDown";

export const GroveAndEdge = ({isPair, toggleIsPair}) => {
  const [groove, setGroove] = useState("Without");

  const grooveOption = [
    "Without",
    "V-groove",
    "U-groove",
    "Square groove",
    "Milgrain",
  ];

  const [leftEdge, setLeftEdge] = useState("Without");

  const leftEdgeOption = ["Without", "Edge", "Milgrain"];

  const widthOptions = [{ value: "0.65 mm" }];

  const [selectedLeftWidthOption, setSelectedLeftWidthOption] = useState(
    widthOptions[0].value
  );
  return (
    <div style={{ margin: "20px 20px" }}>
            <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
      >
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
        />
        <label style={{ marginRight: "10px" }}>
          Use the same settings for both rings
        </label>
      </div>
      <label htmlFor="partition">Partition</label>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {grooveOption.map((item, index) => (
          <button
            style={{
              width: "70px",
              height: "70px",
            }}
            key={index}
            onClick={() => setGroove(item)}
            className={`stone-setting ${
              groove === item && "active-stone-setting"
            } `}
          >
            {item}
          </button>
        ))}
      </div>

      <label htmlFor="partition">Edge</label>

      <br />
      <br />

      <label htmlFor="partition">Left</label>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {leftEdgeOption.map((item, index) => (
          <button
            style={{
              width: "70px",
              height: "70px",
            }}
            key={index}
            onClick={() => setLeftEdge(item)}
            className={`stone-setting ${
              leftEdge === item && "active-stone-setting"
            } `}
          >
            {item}
          </button>
        ))}
        <br />
      </div>

      {leftEdge !== "Without" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <label htmlFor="edge-width">Width</label> <br />
            <DropDown
              isImageLess
              options={widthOptions}
              selectedOption={selectedLeftWidthOption}
              setSelectedOption={setSelectedLeftWidthOption}
            />
          </div>

          <div style={{ marginLeft: "10px" }}>
            <label htmlFor="edge-width">Depth</label>
            <br />
            <DropDown
              isImageLess
              options={widthOptions}
              selectedOption={selectedLeftWidthOption}
              setSelectedOption={setSelectedLeftWidthOption}
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <label htmlFor="edge-width">Surface</label>
            <br />
            <DropDown
              isImageLess
              options={widthOptions}
              selectedOption={selectedLeftWidthOption}
              setSelectedOption={setSelectedLeftWidthOption}
            />
          </div>
        </div>
      )}

      <br />
      <br />

      <label htmlFor="partition">Right</label>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {leftEdgeOption.map((item, index) => (
          <button
            style={{
              width: "70px",
              height: "70px",
            }}
            key={index}
            onClick={() => setLeftEdge(item)}
            className={`stone-setting ${
              leftEdge === item && "active-stone-setting"
            } `}
          >
            {item}
          </button>
        ))}
        <br />
      </div>

      {leftEdge !== "Without" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <label htmlFor="edge-width">Width</label> <br />
            <DropDown
              isImageLess
              options={widthOptions}
              selectedOption={selectedLeftWidthOption}
              setSelectedOption={selectedLeftWidthOption}
            />
          </div>

          <div style={{ marginLeft: "10px" }}>
            <label htmlFor="edge-width">Depth</label>
            <br />
            <DropDown
              isImageLess
              options={widthOptions}
              selectedOption={selectedLeftWidthOption}
              setSelectedOption={selectedLeftWidthOption}
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <label htmlFor="edge-width">Surface</label>
            <br />
            <DropDown
              isImageLess
              options={widthOptions}
              selectedOption={selectedLeftWidthOption}
              setSelectedOption={selectedLeftWidthOption}
            />
          </div>
        </div>
      )}
    </div>
  );
};
