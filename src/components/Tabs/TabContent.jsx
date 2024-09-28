import { Sizes } from "../Sizes";
import EngravingOptions from "../Engraving";
import { GroveAndEdge } from "../GroveAndEdge";
import { PreciousMetal } from "../PreciousMetal";
import { Profile } from "../Profile";
import StepButtons from "../StepButtons";
import { Stone } from "../Stone";

export const TabContent = ({
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
            />
            {stepButton()}
          </>
        );

      case 4:
        return (
          <>
            <GroveAndEdge isPair={isPair} toggleIsPair={toggleIsPair} />
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
        return <div>Step 4: Dimensions Form Content</div>;
      default:
        return <div>Unknown step</div>;
    }
  }
};
