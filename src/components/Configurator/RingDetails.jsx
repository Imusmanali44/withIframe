import { useLocalization } from "../../context/LocalizationContext";
import { useState, useEffect } from "react";
import { getCombinedPricing, getAllSizePricing, formatPrice } from "../../utils/pricing";

export default function RingDetails() {
  const { t } = useLocalization();
  const [currentPricing, setCurrentPricing] = useState({ ring1: 0, ring2: 0 });
  const [currentProfile, setCurrentProfile] = useState('P1');
  
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
      const profile = getCurrentProfile();
      const sizeValues = getAllSizePricing();
      const pricing = getCombinedPricing(profile, sizeValues);
      setCurrentPricing(pricing);
      setCurrentProfile(profile);
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

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileChanged', handleProfileChange);
      window.removeEventListener('sizePricingChanged', handleSizePricingChange);
    };
  }, []);
  
  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full bg-white ring-detail-table">
        <tbody>
          <tr>
            <td></td>
            <td className="py-1 font-semibold uppercase">{t('configurator.ringTypes.wedding')} {t('configurator.ringTypes.ringName').toLowerCase()}</td>
            <td className="py-1 font-semibold uppercase">{t('configurator.ringTypes.wedding')} {t('configurator.ringTypes.ringName').toLowerCase()}</td>
          </tr>
          <tr>
            <td className="py-1 border-b-2 border-black font-semibold">{t('configurator.details.profileAndSize')}</td>
            <td className="py-1 border-b-2 border-black">{t('configurator.ringTypes.ringName')} 1</td>
            <td className="py-1 border-b-2 border-black">{t('configurator.ringTypes.ringName')} 2</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.profile')}</td>
            <td className="py-1 border-b">{currentProfile}</td>
            <td className="py-1 border-b">{currentProfile}</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringWidth')}</td>
            <td className="py-1 border-b">2.00 mm</td>
            <td className="py-1 border-b">5.00 mm</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringThickness')}</td>
            <td className="py-1 border-b">1.80 mm</td>
            <td className="py-1 border-b">1.80 mm</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringSize')}</td>
            <td className="py-1 border-b">64 (Ø 20.4 mm)</td>
            <td className="py-1 border-b">56 (Ø 17.8 mm)</td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('configurator.details.preciousMetal')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringModel')}</td>
            <td className="py-1 border-b">{t('configurator.details.singleColor')}</td>
            <td className="py-1 border-b">{t('configurator.details.singleColor')}</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.distribution')}</td>
            <td className="py-1 border-b">{t('configurator.details.without')}</td>
            <td className="py-1 border-b">{t('configurator.details.without')}</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.cleanlinessColor')}</td>
            <td className="py-1 border-b">14 kt white gold</td>
            <td className="py-1 border-b">14 kt white gold</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.surface')}</td>
            <td className="py-1 border-b">Polished</td>
            <td className="py-1 border-b">Polished</td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('configurator.details.freeGrooves')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.choiceOfGroove')}</td>
            <td className="py-1 border-b">{t('configurator.details.without')} / Polished</td>
            <td className="py-1 border-b">{t('configurator.details.without')} / Polished</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.widthDepth')}</td>
            <td className="py-1 border-b">- / -</td>
            <td className="py-1 border-b">- / -</td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('configurator.details.stoneSetting')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.stoneSetting')}</td>
            <td className="py-1 border-b">
              1 x 0.015 ct. G / SI Brilliant
            </td>
            <td className="py-1 border-b">
              1 x 0.015 ct. G / SI Brilliant
            </td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('tabs.engraving')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.specialEngravings')}</td>
            <td className="py-1 border-b">-</td>
            <td className="py-1 border-b">-</td>
          </tr>
          <tr>
            <td className="py-1 border-b-2 border-black font-semibold">{t('configurator.details.price')}</td>
            <td className="py-1 border-b-2 border-black font-semibold">{formatPrice(currentPricing.ring1)}</td>
            <td className="py-1 border-b-2 border-black font-semibold">{formatPrice(currentPricing.ring2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
