import { useState, useEffect } from 'react';
import { 
  initializePricingData, 
  refreshPricingData, 
  getPricingConfig, 
  getCombinedPricing as getCombinedPricingUtil,
  getPricingForProfileSync 
} from '../utils/pricing.js';

/**
 * Custom hook for managing pricing data from Google Sheets
 * @returns {Object} Hook state and methods
 */
export const usePricing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize pricing data on mount
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await initializePricingData();
        
        const config = getPricingConfig();
        setPricingData(config);
        setLastUpdated(new Date());
        
      } catch (err) {
        console.error('Error loading pricing data:', err);
        setError(err.message);
        
        // Still set fallback data
        const config = getPricingConfig();
        setPricingData(config);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadPricingData();
  }, []);

  // Listen for pricing data updates
  useEffect(() => {
    const handlePricingUpdate = (event) => {
      setPricingData(event.detail.pricingConfig);
      setLastUpdated(new Date());
    };

    window.addEventListener('pricingDataLoaded', handlePricingUpdate);
    
    return () => {
      window.removeEventListener('pricingDataLoaded', handlePricingUpdate);
    };
  }, []);

  // Refresh pricing data manually
  const refreshPricing = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await refreshPricingData();
      
      const config = getPricingConfig();
      setPricingData(config);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error refreshing pricing data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get pricing for a specific profile (synchronous)
  const getPricing = (profileId) => {
    return getPricingForProfileSync(profileId);
  };

  // Get combined pricing (asynchronous)
  const getCombinedPricing = async (profileId, sizeValues) => {
    return await getCombinedPricingUtil(profileId, sizeValues);
  };

  return {
    // State
    isLoading,
    error,
    pricingData,
    lastUpdated,
    
    // Methods
    refreshPricing,
    getPricing,
    getCombinedPricing,
    
    // Utilities
    isDataStale: lastUpdated ? (Date.now() - lastUpdated.getTime()) > 300000 : false, // 5 minutes
    hasError: !!error,
    isReady: !isLoading && !!pricingData
  };
};

export default usePricing; 