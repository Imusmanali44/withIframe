import { Profile } from "./TabsContentDetails/Profile";
import { Sizes } from "./TabsContentDetails/Sizes";
import { PreciousMetal } from "./TabsContentDetails/PreciousMetal/PreciousMetal";
import { GrooveAndEdge } from "./TabsContentDetails/GrooveAndEdge/GrooveAndEdge";
import { Stone } from "./TabsContentDetails/Stone";
import EngravingOptions from "./TabsContentDetails/Engraving";

import StepButtons from "./TabsContentDetails/StepButtons";

const TabContent = ({
  step,
  isExpertMode,
  handleNext,
  handleBack,
  toggleIsPair,
  isPair,
  rings,
  activeRing,
}) => {
  const stepButton = () => (
    <StepButtons
      limit={isExpertMode ? 6 : 4}
      step={step}
      handleBack={handleBack}
      handleNext={handleNext}
    />
  );

  if (isExpertMode) {
    switch (step) {
      case 1:
        return (
          <>
            <Profile isPair={isPair} toggleIsPair={toggleIsPair} />

            {stepButton()}
          </>
        );
      case 2:
        return (
          <>
            <Sizes rings={rings} activeRing={activeRing} />
            {stepButton()}
          </>
        );
      case 3:
        return (
          <>
            <PreciousMetal
              isExpert
              isPair={isPair}
              toggleIsPair={toggleIsPair}
              rings={rings}
              activeRing={activeRing}
            />
            {stepButton()}
          </>
        );

      case 4:
        return (
          <>
            <GrooveAndEdge
              isPair={isPair}
              toggleIsPair={toggleIsPair}
              activeRing={activeRing}
            />
            {stepButton()}
          </>
        );
      case 5:
        return (
          <>
            <Stone />
            {stepButton()}
          </>
        );
      case 6:
        return (
          <>
            <EngravingOptions isPair={isPair} toggleIsPair={toggleIsPair} />
            {stepButton()}
          </>
        );
      default:
        return <div>Unknown step</div>;
    }
  } else {
    switch (step) {
      case 1:
        return <PreciousMetal isPair={isPair} toggleIsPair={toggleIsPair} />;
      case 2:
        return <div>Step 2: Stone Setting Form Content</div>;
      case 3:
        return <div>Step 3: Engraving Form Content</div>;
      case 4:
        return (
          <>
            <Sizes rings={rings} activeRing={activeRing} />
            {stepButton()}
          </>
        );
      default:
        return <div>Unknown step</div>;
    }
  }
};

export default TabContent;
