import { StepLeftSvg, StepRightSvg } from "../../../static/SvgImages";
import { useLocalization } from "../../../context/LocalizationContext";

const StepButtons = ({ limit, handleNext, step, handleBack }) => {
  const { t } = useLocalization();
  
  return (
    <div
      className={`step-buttons flex justify-between gap-5 p-5 pt-3 border-b ${
        step === 1 && "final-step-button"
      }`}
    >
      {step > 1 && (
        <button
          className="px-2.5 py-1.5 bg-[#f1f1f3] font-semibold text-sm flex items-center gap-1"
          onClick={handleBack}
        >
          <StepLeftSvg width={5} height={10} /> {t('navigation.back')}
        </button>
      )}

      {step < limit && (
        <button
          className="px-2.5 py-1.5 bg-[#f1f1f3] font-semibold text-sm flex items-center gap-1"
          onClick={handleNext}
        >
          {t('navigation.next')} <StepRightSvg width={5} height={10} />
        </button>
      )}
    </div>
  );
};

export default StepButtons;
