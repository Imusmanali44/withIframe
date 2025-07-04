// Google Sheets API service for fetching pricing data
const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEETS_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const SHEET_RANGE = 'Sheet1!A:C'; // Adjust range as needed

// Cache for storing fetched data
let cachedPricingData = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetch pricing data from Google Sheets
 * @returns {Promise<Object>} Pricing configuration object
 */
export const fetchPricingFromGoogleSheets = async () => {
  // Check if we have cached data that's still valid
  if (cachedPricingData && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
    return cachedPricingData;
  }

  try {
    if (!GOOGLE_SHEETS_API_KEY || !GOOGLE_SHEETS_ID) {
      console.error('Google Sheets API key or Sheet ID is missing');
      return getFallbackPricingConfig();
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${SHEET_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      throw new Error('No data found in the spreadsheet');
    }
    
    // Parse the data into pricing configuration
    const pricingConfig = parsePricingData(data.values);
    
    // Cache the data
    cachedPricingData = pricingConfig;
    lastFetchTime = Date.now();
    
    // Store in localStorage for offline use
    localStorage.setItem('cachedPricingData', JSON.stringify({
      data: pricingConfig,
      timestamp: lastFetchTime
    }));
    
    return pricingConfig;
    
  } catch (error) {
    console.error('Error fetching pricing data from Google Sheets:', error);
    
    // Try to use localStorage cache if available
    const cachedData = localStorage.getItem('cachedPricingData');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        console.log('Using cached pricing data from localStorage');
        return parsed.data;
      } catch (parseError) {
        console.error('Error parsing cached data:', parseError);
      }
    }
    
    // Fallback to hardcoded configuration
    return getFallbackPricingConfig();
  }
};

/**
 * Parse Google Sheets data into pricing configuration
 * Expected format: [Profile, Ring1 Price, Ring2 Price]
 * @param {Array} values - Raw data from Google Sheets
 * @returns {Object} Parsed pricing configuration
 */
const parsePricingData = (values) => {
  const pricingConfig = {};
  
  // Skip header row if present
  const dataRows = values.slice(1);
  
  dataRows.forEach(row => {
    if (row.length >= 3) {
      const profile = row[0]?.toString().trim();
      const ring1Price = parseFloat(row[1]) || 0;
      const ring2Price = parseFloat(row[2]) || 0;
      
      if (profile) {
        pricingConfig[profile] = {
          ring1: ring1Price,
          ring2: ring2Price
        };
      }
    }
  });
  
  return pricingConfig;
};

/**
 * Get fallback pricing configuration (hardcoded values)
 * @returns {Object} Fallback pricing configuration
 */
const getFallbackPricingConfig = () => {
  return {
    P1: { ring1: 459, ring2: 362 },
    P2: { ring1: 415, ring2: 332 },
    P3: { ring1: 438, ring2: 347 },
    P4: { ring1: 461, ring2: 362 },
    P5: { ring1: 409, ring2: 328 },
    P6: { ring1: 460, ring2: 358 },
    P7: { ring1: 460, ring2: 358 },
    P8: { ring1: 452, ring2: 366 },
    P9: { ring1: 529, ring2: 418 },
    P10: { ring1: 409, ring2: 327 },
    P11: { ring1: 491, ring2: 380 },
    P12: { ring1: 444, ring2: 353 },
    P13: { ring1: 460, ring2: 367 },
    P14: { ring1: 488, ring2: 387 },
    P15: { ring1: 452, ring2: 350 }
  };
};

/**
 * Clear cached pricing data (useful for testing or forcing refresh)
 */
export const clearPricingCache = () => {
  cachedPricingData = null;
  lastFetchTime = null;
  localStorage.removeItem('cachedPricingData');
};

/**
 * Get cached pricing data timestamp
 * @returns {number|null} Timestamp when data was last fetched
 */
export const getCacheTimestamp = () => {
  return lastFetchTime;
}; 