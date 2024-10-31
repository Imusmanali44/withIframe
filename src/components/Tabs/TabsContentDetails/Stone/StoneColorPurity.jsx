const StoneColorPurity = ({ selectedOption, handleChange }) => {
  return (
    <div>
      <h3 className="m-0 font-semibold text-sm text-black">
        Stone color and purity
      </h3>
      <div className="flex flex-col mt-1 bg-white px-6 py-4 ">
        {[
          `E / IF (Colourless+ / flawless)`,
          `G / VS (Near colourless / very slightly included)`,
          `G / SI (Near colourless / slightly included)`,
          `Cubic zirconia AAA (white / very good)`,
        ].map((option) => (
          <label
            key={option}
            className="block relative pl-9 mb-3 text-sm cursor-pointer select-none"
          >
            {option}
            <input
              type="radio"
              name="radio"
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
              className="absolute opacity-0 cursor-pointer"
            />
            <span
              className={`absolute top-0 left-0 h-6 w-6 rounded-full ${
                selectedOption === option ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              {selectedOption === option && (
                <span className="block absolute top-2 left-2 w-2 h-2 bg-white rounded-full" />
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StoneColorPurity;
