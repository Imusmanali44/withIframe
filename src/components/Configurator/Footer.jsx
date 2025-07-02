import { RefreshSvg, ReviewSvg } from "../../static/SvgImages";
import Modal from "../shared/Modal";
import useModal from "../../hooks/useModal";
import RingDetails from "./RingDetails";
import { useLocalization } from "../../context/LocalizationContext";
import { useState, useEffect } from "react";
import { getCombinedPricing, getAllSizePricing, formatPrice } from "../../utils/pricing";

const ConfiguratorFooter = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useLocalization();
  const [currentPricing, setCurrentPricing] = useState({ ring1: 0, ring2: 0 });

  const handleResetConfiguration = () => {
    console.log('Reset configuration')
  };

  // Function to get the current profile from localStorage
  const getCurrentProfile = () => {
    // Check for any profile keys in localStorage
    const keys = Object.keys(localStorage);
    const profileKey = keys.find(key => key.startsWith('activeProfile_'));
    
    if (profileKey) {
      const profile = localStorage.getItem(profileKey);
      return profile;
    }
    
    // Default to P1 if no profile is found
    return 'P1';
  };

  // Update pricing when component mounts and when localStorage changes
  useEffect(() => {
    const updatePricing = () => {
      const currentProfile = getCurrentProfile();
      const sizeValues = getAllSizePricing();
      const pricing = getCombinedPricing(currentProfile, sizeValues);
      setCurrentPricing(pricing);
    };

    // Initial load
    updatePricing();

    // Listen for storage changes
    const handleStorageChange = () => {
      updatePricing();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when profile changes within the same window
    const handleProfileChange = () => {
      updatePricing();
    };

    window.addEventListener('profileChanged', handleProfileChange);
    
    // Listen for size pricing changes
    const handleSizePricingChange = () => {
      updatePricing();
    };

    window.addEventListener('sizePricingChanged', handleSizePricingChange);
    
    // Listen for engraving pricing changes
    const handleEngravingPricingChange = () => {
      updatePricing();
    };

    window.addEventListener('engravingPricingChanged', handleEngravingPricingChange);
    
    // Listen for precious metal pricing changes
    const handlePreciousMetalPricingChange = () => {
      updatePricing();
    };

    window.addEventListener('preciousMetalPricingChanged', handlePreciousMetalPricingChange);
    
    // Listen for groove and step pricing changes
    const handleGrooveStepPricingChange = () => {
      updatePricing();
    };

    window.addEventListener('grooveStepPricingChanged', handleGrooveStepPricingChange);
    
    // Listen for stone pricing changes
    const handleStonePricingChange = () => {
      updatePricing();
    };

    window.addEventListener('stonePricingChanged', handleStonePricingChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileChanged', handleProfileChange);
      window.removeEventListener('sizePricingChanged', handleSizePricingChange);
      window.removeEventListener('engravingPricingChanged', handleEngravingPricingChange);
      window.removeEventListener('preciousMetalPricingChanged', handlePreciousMetalPricingChange);
      window.removeEventListener('grooveStepPricingChanged', handleGrooveStepPricingChange);
      window.removeEventListener('stonePricingChanged', handleStonePricingChange);
    };
  }, []);

  // Calculate total price
  const totalPrice = currentPricing.ring1 + currentPricing.ring2;

  return (
    <div className="flex flex-col-reverse lg:flex-row p-4 w-full bg-[#f1f1f3]">
      <div className="lg:w-[60%] px-5 lg:border-r-2 border-white pt-3 lg:pt-0">
        <div className="flex flex-col items-center max-w-[300px]">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="text-sm ">{t('configurator.ringTypes.ringName')} 1</div>
              <div className="text-sm ">{formatPrice(currentPricing.ring1)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm ">{t('configurator.ringTypes.ringName')} 2</div>
              <div className="text-sm ">{formatPrice(currentPricing.ring2)}</div>
            </div>
          </div>
          <div className="flex justify-between mt-2 w-full">
            <div className="text-sm font-semibold">{t('configurator.pricing.totalPrice')}</div>
            <div className="text-sm font-semibold">{formatPrice(totalPrice)}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between lg:flex-col px-7 border-b-2 lg:border-b-0 border-white pb-3 lg:pb-0">
        <button className="btn-inline flex items-center gap-1.5 lg:mb-2.5" onClick={handleResetConfiguration}>
          <i className="text-primary svg-icon svg-icon-refresh">
            <RefreshSvg />
          </i>
          <span className="text-sm">{t('buttons.resetConfiguration')}</span>
        </button>
        <button
          className="flex items-center rounded-full bg-white border px-5 py-2 gap-1.5"
          onClick={openModal}
        >
          <i className="svg-icon svg-icon-review">
            <ReviewSvg />
          </i>
          <span className="text-sm font-semibold">{t('configurator.yourRings')}</span>
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        title={t('configurator.yourRings')}
        bodyContent={<RingDetails />}
        primaryAction={{ label: t('buttons.close'), onClick: closeModal }}
      />
    </div>
  );
};

export default ConfiguratorFooter;
