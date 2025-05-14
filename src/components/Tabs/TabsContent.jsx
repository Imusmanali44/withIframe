import { Profile } from "./TabsContentDetails/Profile";
import { Sizes } from "./TabsContentDetails/Sizes";
import { PreciousMetal } from "./TabsContentDetails/PreciousMetal/PreciousMetal";
import { GrooveAndEdge } from "./TabsContentDetails/GrooveAndEdge/GrooveAndEdge";
import { Stone } from "./TabsContentDetails/Stone/Stone";
import EngravingOptions from "./TabsContentDetails/Engraving/Engraving";
import { useLocalization } from "../../context/LocalizationContext";

import StepButtons from "./TabsContentDetails/StepButtons";

const TabContent = ({
  step,
  isExpertMode,
  handleNext,
  handleBack,
  setIsPair,
  isPair,
  rings,
  activeRing,
}) => {
  const { t } = useLocalization();
  
  const stepButton = () => (
    <StepButtons
      limit={isExpertMode ? 6 : 4}
      step={step}
      handleBack={handleBack}
      handleNext={handleNext}
    />
  );
  if (activeRing?.type === "Engagement") {
    if (isExpertMode) {
      switch (step) {
        case 1:
          return (
            <>
              <Sizes rings={rings} activeRing={activeRing} />

              {stepButton()}
            </>
          );
        case 2:
          return (
            <>
              <PreciousMetal
                isExpert
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        case 3:
          return (
            <>
              <Stone
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
                isExpertMode={isExpertMode}
              />
              {stepButton()}
            </>
          );

        case 4:
          return (
            <>
              <EngravingOptions
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        default:
          return <div>{t('tabs.unknownStep')}</div>;
      }
    } else {
      switch (step) {
        case 1:
          return (
            <>
              <Stone
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
                isExpertMode={isExpertMode}
              />
              {stepButton()}
            </>
          );
        case 2:
          return (
            <>
              <EngravingOptions
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        case 3:
          return (
            <>
              <Sizes rings={rings} activeRing={activeRing} />
              {stepButton()}
            </>
          );
        default:
          return <div>{t('tabs.unknownStep')}</div>;
      }
    }
  } else {
    if (isExpertMode) {
      switch (step) {
        case 1:
          return (
            <>
              <Profile
                rings={rings}
                activeRing={activeRing}
                isPair={isPair}
                setIsPair={setIsPair}
              />

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
                setIsPair={setIsPair}
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
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        case 5:
          return (
            <>
              <Stone
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
                isExpertMode={isExpertMode}
              />
              {stepButton()}
            </>
          );
        case 6:
          return (
            <>
              <EngravingOptions
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        default:
          return <div>{t('tabs.unknownStep')}</div>;
      }
    } else {
      switch (step) {
        case 1:
          return (
            <>
              <PreciousMetal
                isExpert
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        case 2:
          return (
            <>
              <Stone
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
                isExpertMode={isExpertMode}
              />
              {stepButton()}
            </>
          );
        case 3:
          return (
            <>
              <EngravingOptions
                isPair={isPair}
                setIsPair={setIsPair}
                rings={rings}
                activeRing={activeRing}
              />
              {stepButton()}
            </>
          );
        case 4:
          return (
            <>
              <Sizes rings={rings} activeRing={activeRing} />
              {stepButton()}
            </>
          );
        default:
          return <div>{t('tabs.unknownStep')}</div>;
      }
    }
  }
};

export default TabContent;
