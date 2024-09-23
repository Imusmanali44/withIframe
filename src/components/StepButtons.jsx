const StepButtons = ({ limit, handleNext, step, handleBack }) => {
  return (
    <div
      className={`step-buttons ${step === 1 && "final-step-button"}`}
      style={{
        marginLeft: "45px",
        marginRight: "45px",
        marginTop: "10px",
      }}
    >
      {step > 1 && <button onClick={handleBack}>Back</button>}

      {step < limit && <button onClick={handleNext}> Next </button>}
    </div>
  );
};

export default StepButtons;
