export const pricingConfig = {
  P1: {
    ring1: 459,
    ring2: 362
  },
  P2: {
    ring1: 415,
    ring2: 332
  },
  P3: {
    ring1: 438,
    ring2: 347
  },
  P4: {
    ring1: 461,
    ring2: 362
  },
  P5: {
    ring1: 409,
    ring2: 328
  },
  P6: {
    ring1: 460,
    ring2: 358
  },
  P7: {
    ring1: 460,
    ring2: 358
  },
  P8: {
    ring1: 452,
    ring2: 366
  },
  P9: {
    ring1: 529,
    ring2: 418
  },
  P10: {
    ring1: 409,
    ring2: 327
  },
  P11: {
    ring1: 491,
    ring2: 380
  },
  P12: {
    ring1: 444,
    ring2: 353
  },
  P13: {
    ring1: 460,
    ring2: 367
  },
  P14: {
    ring1: 488,
    ring2: 387
  },
  P15: {
    ring1: 452,
    ring2: 350
  }
};

// Size pricing configuration
export const sizePricingConfig = {
  // Default baseline values for pricing calculations
  defaults: {
    ring1: {
      width: "4,50 mm",
      thickness: "1,70 mm",
      size: "62"
    },
    ring2: {
      width: "3,50 mm", 
      thickness: "1,70 mm",
      size: "56"
    }
  },
  // Price per unit change
  pricePerUnit: {
    width: 100, // 50 per 0.5mm (so 100 per 1mm)
    thickness: 400, // 40 per 0.1mm (so 400 per 1mm)
    size: 37 // 37 per size unit
  }
};

// Helper function to parse mm value to number
const parseMMValue = (value) => {
  if (!value) return 0;
  // Convert "4,50 mm" to 4.5
  const numericPart = value.replace(/\s*mm\s*$/, '').replace(',', '.');
  return parseFloat(numericPart) || 0;
};

// Helper function to parse size value to number
const parseSizeValue = (value, country) => {
  if (!value) return 0;
  
  // For EU, ES, PL: direct numeric conversion
  if (country === "EU" || country === "ES" || country === "PL") {
    return parseInt(value) || 0;
  }
  
  // For UK: convert letter sizes to numeric equivalent
  if (country === "UK") {
    const ukSizes = {
      "F": 50, "F½": 51, "G": 52, "G½": 53, "H": 54, "H½": 55,
      "I": 56, "I½": 57, "J": 58, "J½": 59
    };
    return ukSizes[value] || 0;
  }
  
  // For US: direct conversion
  if (country === "US") {
    return parseFloat(value) * 10 || 0; // Convert to EU equivalent scale
  }
  
  return 0;
};

// Calculate price adjustments for size changes
export const calculateSizeAdjustments = (currentValues, ringKey) => {
  const defaults = sizePricingConfig.defaults[ringKey];
  const pricePerUnit = sizePricingConfig.pricePerUnit;
  
  // If no size adjustments have been made, return 0 (no price change)
  if (!defaults || !currentValues) return 0;
  
  let totalAdjustment = 0;
  
  // Width adjustment (in mm)
  const defaultWidth = parseMMValue(defaults.width);
  const currentWidth = parseMMValue(currentValues.width);
  const widthDiff = currentWidth - defaultWidth;
  
  // Only apply adjustment if there's an actual difference
  if (Math.abs(widthDiff) > 0.01) { // 0.01mm tolerance for floating point precision
    totalAdjustment += widthDiff * pricePerUnit.width;
  }
  
  // Thickness adjustment (in mm) - only if not auto
  if (!currentValues.isAuto) {
    const defaultThickness = parseMMValue(defaults.thickness);
    const currentThickness = parseMMValue(currentValues.thickness);
    const thicknessDiff = currentThickness - defaultThickness;
    
    // Only apply adjustment if there's an actual difference
    if (Math.abs(thicknessDiff) > 0.01) { // 0.01mm tolerance for floating point precision
      totalAdjustment += thicknessDiff * pricePerUnit.thickness;
    }
  }
  
  // Size adjustment
  const defaultSize = parseSizeValue(defaults.size, "EU");
  const currentSize = parseSizeValue(currentValues.size, currentValues.sizeCountry);
  const sizeDiff = currentSize - defaultSize;
  
  // Only apply adjustment if there's an actual difference
  if (Math.abs(sizeDiff) > 0.1) { // Small tolerance for size differences
    totalAdjustment += sizeDiff * pricePerUnit.size;
  }
  
  return Math.round(totalAdjustment);
};

// Get combined pricing (profile + size adjustments)
export const getCombinedPricing = (profileId, sizeValues) => {
  const basePricing = getPricingForProfile(profileId);
  
  const ring1Adjustment = calculateSizeAdjustments(sizeValues?.ring1, 'ring1');
  const ring2Adjustment = calculateSizeAdjustments(sizeValues?.ring2, 'ring2');
  
  return {
    ring1: basePricing.ring1 + ring1Adjustment,
    ring2: basePricing.ring2 + ring2Adjustment
  };
};

// Save size pricing to localStorage
export const saveSizePricing = (ringKey, values) => {
  const storageKey = `sizePricing_${ringKey}`;
  localStorage.setItem(storageKey, JSON.stringify(values));
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('sizePricingChanged', { 
    detail: { ringKey, values } 
  }));
};

// Load size pricing from localStorage
export const loadSizePricing = (ringKey) => {
  const storageKey = `sizePricing_${ringKey}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : null;
};

// Get all size pricing for current configuration
export const getAllSizePricing = () => {
  const ring1Values = loadSizePricing('ring1'); // Don't fallback to defaults
  const ring2Values = loadSizePricing('ring2'); // Don't fallback to defaults
  
  return {
    ring1: ring1Values,
    ring2: ring2Values
  };
};

// Helper function to get pricing for a specific profile
export const getPricingForProfile = (profileId) => {
  return pricingConfig[profileId] || { ring1: 0, ring2: 0 };
};

// Helper function to format price with euro symbol
export const formatPrice = (price) => {
  return `${price} €`;
}; 