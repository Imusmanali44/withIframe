export const DimensionForm = () => {
  return (
    <div className="form-container">
      <div className="column">
        <h3>Ring 1</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            className="ring-width-1-before"
            style={{ paddingRight: "5px" }}
          ></div>
          <div>
            <label htmlFor="ring-width-1">Ring width</label>
            <select id="ring-width-1" style={{ width: "190px" }}>
              <option value="4.50">4.50 mm</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            className="ring-width-2-before"
            style={{ paddingRight: "5px" }}
          ></div>
          <div>
            <label htmlFor="ring-thickness-1">Ring thickness</label>
            <select id="ring-thickness-1" style={{ width: "190px" }}>
              <option value="1.50">1.50 mm</option>
            </select>
          </div>
        </div>

        <div className="auto-setting">
          <input type="checkbox" id="auto-thickness-1" />
          <label htmlFor="auto-thickness-1">
            Automatically set the optimal thickness
          </label>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            className="ring-width-3-before"
            style={{ paddingRight: "5px" }}
          ></div>

          <div>
            <label htmlFor="ring-size-1">Ring size</label>
            <select id="ring-size-1" style={{ width: "190px" }}>
              <option value="T½">T½</option>
            </select>
          </div>
        </div>
      </div>

      <div className="column">
        <h3>Ring 2</h3>
        <label htmlFor="ring-width-2">Ring width</label>
        <select id="ring-width-2">
          <option value="3.50">3.50 mm</option>
        </select>

        <label htmlFor="ring-thickness-2">Ring thickness</label>
        <select id="ring-thickness-2">
          <option value="1.50">1.50 mm</option>
        </select>

        <div className="auto-setting">
          <input type="checkbox" id="auto-thickness-2" />
          <label htmlFor="auto-thickness-2">
            Automatically set the optimal thickness
          </label>
        </div>

        <label htmlFor="ring-size-2">Ring size</label>
        <select id="ring-size-2">
          <option value="O½">O½</option>
        </select>
      </div>
    </div>
  );
};
