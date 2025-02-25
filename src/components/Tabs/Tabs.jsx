import {
  tabOptions,
  nonExpertTabOptions,
  engagementTabOptions,
  engagementNonExpertTabOptions,
} from "../../utils";
import { StepLeftSvg, StepRightSvg } from "../../static/SvgImages";

export const Tabs = ({
  handleNext,
  handleBack,
  setStep,
  isExpertMode,
  step,
  activeRing,
}) => {
  // Ensure activeRing exists before accessing type
  const options = activeRing?.type === "Engagement"
    ? isExpertMode
      ? engagementTabOptions
      : engagementNonExpertTabOptions
    : isExpertMode
      ? tabOptions
      : nonExpertTabOptions;

  return (
    <nav className="flex items-center flex-row w-full">
      <button className="config-arrow config-arrow-left" onClick={handleBack}>
        <i className="svg-icon svg-icon-step-left active">
          <StepLeftSvg width={12} height={24} />
        </i>
      </button>
      <div className="flex justify-start items-center flex-1 overflow-auto">
        {options?.map((tab) => (
          <div
            key={tab.id}
            className={`options font-semibold lg:flex items-center justify-center lg:flex-1 lg:max-w-56 hidden lg:w-52 w-full ${
              tab.id === step && "option-active !flex"
            }`}
            onClick={() => setStep(tab.id)}
          >
            <span className="configurator-nav-number">{tab.id}.</span>
            {tab.title}
            <span className="configurator-nav-link-shadow"></span>
          </div>
        ))}
      </div>
      <button className="config-arrow" onClick={handleNext}>
        <i className="svg-icon svg-icon-step-right">
          <StepRightSvg width={12} height={24} />
        </i>
      </button>
    </nav>
  );
};
