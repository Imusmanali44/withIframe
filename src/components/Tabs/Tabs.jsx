import { tabOptions, nonExpertTabOptions } from "../../utils";
import { StepLeftSvg, StepRightSvg } from "../../static/SvgImages";

export const Tabs = ({
  handleNext,
  handleBack,
  setStep,
  isExpertMode,
  step,
}) => {
  const options = isExpertMode ? tabOptions : nonExpertTabOptions;

  return (
    <nav className="flex items-center flex-row w-full">
      <a className="config-arrow config-arrow-left" onClick={handleBack}>
        <i className="svg-icon svg-icon-step-left active">
          <StepLeftSvg />
        </i>
      </a>
      <div className="flex justify-start items-center flex-1 overflow-auto">
        {options?.map((tab) => (
          <div
            key={tab.id}
            className={`options lg:flex items-center justify-center lg:flex-1 lg:max-w-56 hidden lg:w-52 w-full ${
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
      <a className="config-arrow" onClick={handleNext}>
        <i className="svg-icon svg-icon-step-right">
          <StepRightSvg />
        </i>
      </a>
    </nav>
  );
};
