import { useState } from "react";

export const Sizes = ({ activeRing }) => {
  const [isRing1Auto, setIsRing1Auto] = useState(false);
  const [isRing2Auto, setIsRing2Auto] = useState(false);

  const handleRing1WidthChange = (e) => {
    console.log(`Ring 1 Width selected: ${e.target.value}`);
  };

  const handleRing1ThicknessChange = (e) => {
    console.log(`Ring 1 Thickness selected: ${e.target.value}`);
  };

  const handleRing1SizeChange = (e) => {
    console.log(`Ring 1 Size selected: ${e.target.value}`);
  };

  const handleRing2WidthChange = (e) => {
    console.log(`Ring 2 Width selected: ${e.target.value}`);
  };

  const handleRing2ThicknessChange = (e) => {
    console.log(`Ring 2 Thickness selected: ${e.target.value}`);
  };

  const handleRing2SizeChange = (e) => {
    console.log(`Ring 2 Size selected: ${e.target.value}`);
  };
  
  console.log("Active Ring(s):", activeRing);

  return (
    <div className="flex flex-col lg:flex-row justify-between w-full max-w-[500px] mx-auto px-3 py-5 gap-5 mb-auto">
      {Array.isArray(activeRing) && activeRing[0]?.type === "Wedding" ? (
        <>
          <div className="lg:w-1/2 lg:ml-12">
            <h3 className="mb-3 font-semibold text-sm">{activeRing[0].name}</h3>
            <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-3">
              <div className="w-1/2 lg:w-auto mb-3 ring-width-1-before relative">
                <label className="block mb-1 font-semibold text-sm">
                  Ring width
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  onChange={handleRing1WidthChange}
                >
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
                  Ring thickness
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  disabled={isRing1Auto}
                  onChange={handleRing1ThicknessChange}
                >
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
                onChange={() => setIsRing1Auto(!isRing1Auto)}
              />
              <label className="font-semibold text-sm">
                Automatically set the optimal thickness
              </label>
            </div>

            <div className="ring-width-3-before relative">
              <label className="block mb-1 font-semibold text-sm">
                Ring size
              </label>
              <div className="flex">
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  onChange={handleRing1SizeChange}
                >
                  <option value="UK">UK</option>
                  <option value="ES">ES</option>
                  <option value="PL">PL</option>
                  <option value="US">US</option>
                </select>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  onChange={handleRing1SizeChange}
                >
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
                  Ring width
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  onChange={handleRing2WidthChange}
                >
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
                  Ring thickness
                </label>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  disabled={isRing2Auto}
                  onChange={handleRing2ThicknessChange}
                >
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
                checked={isRing2Auto}
                onChange={() => setIsRing2Auto(!isRing2Auto)}
              />
              <label className="font-semibold text-sm">
                Automatically set the optimal thickness
              </label>
            </div>

            <div className="relative">
              <label className="block mb-1 font-semibold text-sm">
                Ring size
              </label>
              <div className="flex">
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  onChange={handleRing2SizeChange}
                >
                  <option value="UK">UK</option>
                  <option value="ES">ES</option>
                  <option value="PL">PL</option>
                  <option value="US">US</option>
                </select>
                <select
                  className="w-full border hover:border-[#909090] rounded px-2 py-3"
                  onChange={handleRing2SizeChange}
                >
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
                    Ring width
                  </label>
                  <select
                    className="w-full border hover:border-[#909090] rounded px-2 py-3"
                    onChange={handleRing1WidthChange}
                  >
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
                    Ring thickness
                  </label>
                  <select
                    className="w-full border hover:border-[#909090] rounded px-2 py-3"
                    disabled={isRing1Auto}
                    onChange={handleRing1ThicknessChange}
                  >
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

              <div className="flex mb-3 auto-setting">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isRing1Auto}
                  onChange={() => setIsRing1Auto(!isRing1Auto)}
                />
                <label className="font-semibold text-sm">
                  Automatically set the optimal thickness
                </label>
              </div>
            </>
          )}
          <div className="ring-width-3-before relative">
            <label className="block mb-1 font-semibold text-sm">
              Ring size
            </label>
            <div className="flex">
              <select
                className="w-full border hover:border-[#909090] rounded px-2 py-3"
                onChange={handleRing1SizeChange}
              >
                <option value="UK">UK</option>
                <option value="ES">ES</option>
                <option value="PL">PL</option>
                <option value="US">US</option>
              </select>
              <select
                className="w-full border hover:border-[#909090] rounded px-2 py-3"
                onChange={handleRing1SizeChange}
              >
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
