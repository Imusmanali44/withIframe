import { fetchPricingFromGoogleSheets } from '../services/googleSheets.js';

// Dynamic pricing configuration (loaded from Google Sheets)
let pricingConfig = {
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

// Flag to track if pricing data has been loaded
let pricingDataLoaded = false;

/**
 * Initialize pricing data from Google Sheets
 * @returns {Promise<void>}
 */
export const initializePricingData = async () => {
  if (pricingDataLoaded) {
    return;
  }
  
  try {
    const fetchedPricing = await fetchPricingFromGoogleSheets();
    pricingConfig = fetchedPricing;
    pricingDataLoaded = true;
    
    // Trigger a pricing update event
    window.dispatchEvent(new CustomEvent('pricingDataLoaded', { 
      detail: { pricingConfig } 
    }));
    
  } catch (error) {
    console.error('Failed to initialize pricing data:', error);
    // Keep using fallback pricing config
  }
};

/**
 * Get current pricing configuration
 * @returns {Object} Current pricing configuration
 */
export const getPricingConfig = () => {
  return pricingConfig;
};

/**
 * Refresh pricing data from Google Sheets
 * @returns {Promise<void>}
 */
export const refreshPricingData = async () => {
  pricingDataLoaded = false;
  await initializePricingData();
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

// Get combined pricing (profile + size adjustments + engraving + precious metal + grooves + steps + stones)
export const getCombinedPricing = async (profileId, sizeValues) => {
  // Ensure pricing data is loaded
  await initializePricingData();
  
  const basePricing = await getPricingForProfile(profileId);
  
  const ring1Adjustment = calculateSizeAdjustments(sizeValues?.ring1, 'ring1');
  const ring2Adjustment = calculateSizeAdjustments(sizeValues?.ring2, 'ring2');
  
  const engravingCosts = getAllEngravingCosts();
  const preciousMetalCosts = getAllPreciousMetalCosts();
  const grooveCosts = getAllGrooveCosts();
  const stepCosts = getAllStepCosts();
  const stoneCosts = getAllStoneCosts();
  
  return {
    ring1: basePricing.ring1 + ring1Adjustment + engravingCosts.ring1 + preciousMetalCosts.ring1 + grooveCosts.ring1 + stepCosts.ring1 + stoneCosts.ring1,
    ring2: basePricing.ring2 + ring2Adjustment + engravingCosts.ring2 + preciousMetalCosts.ring2 + grooveCosts.ring2 + stepCosts.ring2 + stoneCosts.ring2
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
export const getPricingForProfile = async (profileId) => {
  // Ensure pricing data is loaded
  await initializePricingData();
  
  return pricingConfig[profileId] || { ring1: 0, ring2: 0 };
};

// Synchronous version for backward compatibility (uses cached data)
export const getPricingForProfileSync = (profileId) => {
  return pricingConfig[profileId] || { ring1: 0, ring2: 0 };
};

// Engraving pricing configuration
export const engravingPricingConfig = {
  pricePerLetter: 10,
  pricePerSymbol: 20
};

// Precious metal pricing configuration
export const preciousMetalPricingConfig = {
  singleColor: 0,
  twoTone: 50,
  triColored: 100
};

// Groove and step pricing configuration
export const grooveStepPricingConfig = {
  groove: {
    regular: 50, // V-groove, U-groove, Corner joint
    milgrain: 150
  },
  step: {
    regular: 50, // Normal step
    milgrain: 150
  }
};

// Stone pricing configuration
export const stonePricingConfig = {
  stoneTypes: {
    "Brilliant": 450,
    "Princess": 620,
    "Baguette": 380
  },
  stoneStyles: {
    "Without": 0,
    "Smooth conversion": 320,
    "Pavé": 540,
    "Rail setting": 480,
    "Smooth Stone": 350,
    "Rail setting Across": 510,
    "Smooth setting Across": 460,
    "Channel side": 590,
    "Free layout": 670,
    "Tension ring": 690,
    "Tension ring diagonally": 720,
    "Canal around": 580
  },
  stoneSizes: {
    "0.005 ct. (Ø 1.0 mm)": 0,
    "0.005 ct. (Ø 1.3 mm)": 50,
    "0.005 ct. (Ø 1.5 mm)": 100
  }
};

// Save engraving text for a specific ring
export const saveEngravingText = (ringKey, text) => {
  const storageKey = `engravingText_${ringKey}`;
  localStorage.setItem(storageKey, text || '');
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('engravingPricingChanged', { 
    detail: { ringKey, text } 
  }));
};

// Load engraving text for a specific ring
export const loadEngravingText = (ringKey) => {
  const storageKey = `engravingText_${ringKey}`;
  return localStorage.getItem(storageKey) || '';
};

// Save engraving symbol for a specific ring
export const saveEngravingSymbol = (ringKey, symbol) => {
  const storageKey = `engravingSymbol_${ringKey}`;
  localStorage.setItem(storageKey, symbol || '');
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('engravingPricingChanged', { 
    detail: { ringKey, symbol } 
  }));
};

// Load engraving symbol for a specific ring
export const loadEngravingSymbol = (ringKey) => {
  const storageKey = `engravingSymbol_${ringKey}`;
  return localStorage.getItem(storageKey) || '';
};

// Save precious metal partition for a specific ring
export const savePreciousMetalPartition = (ringKey, partition) => {
  const storageKey = `preciousMetalPartition_${ringKey}`;
  localStorage.setItem(storageKey, JSON.stringify(partition));
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('preciousMetalPricingChanged', { 
    detail: { ringKey, partition } 
  }));
};

// Load precious metal partition for a specific ring
export const loadPreciousMetalPartition = (ringKey) => {
  const storageKey = `preciousMetalPartition_${ringKey}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : { name: "Single" };
};

// Calculate engraving cost for a specific ring
export const calculateEngravingCost = (ringKey) => {
  const text = loadEngravingText(ringKey);
  const symbol = loadEngravingSymbol(ringKey);
  
  let totalCost = 0;
  
  // Count only letters and numbers, exclude symbols and spaces
  if (text) {
    const letterCount = text.replace(/[^a-zA-Z0-9]/g, '').length;
    totalCost += letterCount * engravingPricingConfig.pricePerLetter;
  }
  
  // Add symbol cost (only one symbol allowed)
  if (symbol) {
    totalCost += engravingPricingConfig.pricePerSymbol;
  }
  
  return totalCost;
};

// Calculate precious metal cost for a specific ring
export const calculatePreciousMetalCost = (ringKey) => {
  const partition = loadPreciousMetalPartition(ringKey);
  
  switch (partition.name) {
    case "Two tone":
      return preciousMetalPricingConfig.twoTone;
    case "Tri Colored":
      return preciousMetalPricingConfig.triColored;
    case "Single":
    default:
      return preciousMetalPricingConfig.singleColor;
  }
};

// Save groove configuration for a specific ring
export const saveGrooveConfiguration = (ringKey, grooveConfig) => {
  const storageKey = `grooveConfig_${ringKey}`;
  localStorage.setItem(storageKey, JSON.stringify(grooveConfig));
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('grooveStepPricingChanged', { 
    detail: { ringKey, type: 'groove', config: grooveConfig } 
  }));
};

// Load groove configuration for a specific ring
export const loadGrooveConfiguration = (ringKey) => {
  const storageKey = `grooveConfig_${ringKey}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : { type: "Without", grooves: [] };
};

// Save step configuration for a specific ring
export const saveStepConfiguration = (ringKey, stepConfig) => {
  const storageKey = `stepConfig_${ringKey}`;
  localStorage.setItem(storageKey, JSON.stringify(stepConfig));
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('grooveStepPricingChanged', { 
    detail: { ringKey, type: 'step', config: stepConfig } 
  }));
};

// Load step configuration for a specific ring
export const loadStepConfiguration = (ringKey) => {
  const storageKey = `stepConfig_${ringKey}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : { left: "Without", right: "Without" };
};

// Calculate groove cost for a specific ring
export const calculateGrooveCost = (ringKey) => {
  const grooveConfig = loadGrooveConfiguration(ringKey);
  
  if (!grooveConfig || grooveConfig.type === "Without" || !grooveConfig.grooves) {
    return 0;
  }
  
  let costPerGroove = 0;
  
  // Determine cost per groove based on type
  if (grooveConfig.type === "Milgrain") {
    costPerGroove = grooveStepPricingConfig.groove.milgrain;
  } else if (grooveConfig.type !== "Without") {
    // V-groove, U-groove, Corner joint all cost the same
    costPerGroove = grooveStepPricingConfig.groove.regular;
  }
  
  // Multiply by number of grooves
  const numberOfGrooves = grooveConfig.grooves.length || 0;
  return costPerGroove * numberOfGrooves;
};

// Calculate step cost for a specific ring
export const calculateStepCost = (ringKey) => {
  const stepConfig = loadStepConfiguration(ringKey);
  
  if (!stepConfig) {
    return 0;
  }
  
  let totalCost = 0;
  
  // Calculate left step cost
  if (stepConfig.left === "Milgrain") {
    totalCost += grooveStepPricingConfig.step.milgrain;
  } else if (stepConfig.left === "Step") {
    totalCost += grooveStepPricingConfig.step.regular;
  }
  
  // Calculate right step cost
  if (stepConfig.right === "Milgrain") {
    totalCost += grooveStepPricingConfig.step.milgrain;
  } else if (stepConfig.right === "Step") {
    totalCost += grooveStepPricingConfig.step.regular;
  }
  
  return totalCost;
};

// Save stone configuration for a specific ring and stone tab
export const saveStoneConfiguration = (ringKey, stoneTabId, stoneConfig) => {
  const storageKey = `stoneConfig_${ringKey}_tab${stoneTabId}`;
  localStorage.setItem(storageKey, JSON.stringify(stoneConfig));
  
  // Trigger pricing update event
  window.dispatchEvent(new CustomEvent('stonePricingChanged', { 
    detail: { ringKey, stoneTabId, config: stoneConfig } 
  }));
};

// Load stone configuration for a specific ring and stone tab
export const loadStoneConfiguration = (ringKey, stoneTabId) => {
  const storageKey = `stoneConfig_${ringKey}_tab${stoneTabId}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : { 
    style: "Without", 
    type: "Without", 
    size: "0.005 ct. (Ø 1.0 mm)", 
    number: 1,
    colorPurity: null
  };
};

// Calculate stone cost for a specific ring
export const calculateStoneCost = (ringKey) => {
  // Get all stone tabs for this ring by checking localStorage
  let totalCost = 0;
  
  // Check for up to 10 possible stone tabs (should be enough)
  for (let tabId = 1; tabId <= 10; tabId++) {
    const stoneConfig = loadStoneConfiguration(ringKey, tabId);
    
    // Skip if this is a default "Without" configuration (no actual stone)
    if (stoneConfig.style === "Without") {
      continue;
    }
    
    let stoneCost = 0;
    
    // Add style cost
    stoneCost += stonePricingConfig.stoneStyles[stoneConfig.style] || 0;
    
    // Add type cost
    stoneCost += stonePricingConfig.stoneTypes[stoneConfig.type] || 0;
    
    // Add size cost
    stoneCost += stonePricingConfig.stoneSizes[stoneConfig.size] || 0;
    
    // Multiply by number of stones
    const numberOfStones = parseInt(stoneConfig.number) || 1;
    stoneCost *= numberOfStones;
    
    totalCost += stoneCost;
  }
  
  return totalCost;
};

// Get all engraving costs
export const getAllEngravingCosts = () => {
  return {
    ring1: calculateEngravingCost('ring1'),
    ring2: calculateEngravingCost('ring2'),
    ring3: calculateEngravingCost('ring3')
  };
};

// Get all precious metal costs
export const getAllPreciousMetalCosts = () => {
  return {
    ring1: calculatePreciousMetalCost('ring1'),
    ring2: calculatePreciousMetalCost('ring2'),
    ring3: calculatePreciousMetalCost('ring3')
  };
};

// Get all groove costs
export const getAllGrooveCosts = () => {
  return {
    ring1: calculateGrooveCost('ring1'),
    ring2: calculateGrooveCost('ring2'),
    ring3: calculateGrooveCost('ring3')
  };
};

// Get all step costs
export const getAllStepCosts = () => {
  return {
    ring1: calculateStepCost('ring1'),
    ring2: calculateStepCost('ring2'),
    ring3: calculateStepCost('ring3')
  };
};

// Get all stone costs
export const getAllStoneCosts = () => {
  return {
    ring1: calculateStoneCost('ring1'),
    ring2: calculateStoneCost('ring2'),
    ring3: calculateStoneCost('ring3')
  };
};

// Get engraving cost breakdown for display
export const getEngravingCostBreakdown = () => {
  const costs = getAllEngravingCosts();
  const breakdown = {};
  
  Object.keys(costs).forEach(ringKey => {
    const text = loadEngravingText(ringKey);
    const symbol = loadEngravingSymbol(ringKey);
    const letterCount = text ? text.replace(/[^a-zA-Z0-9]/g, '').length : 0;
    const letterCost = letterCount * engravingPricingConfig.pricePerLetter;
    const symbolCost = symbol ? engravingPricingConfig.pricePerSymbol : 0;
    
    breakdown[ringKey] = {
      text,
      symbol,
      letterCount,
      letterCost,
      symbolCost,
      totalCost: costs[ringKey]
    };
  });
  
  return breakdown;
};

// Get precious metal cost breakdown for display
export const getPreciousMetalCostBreakdown = () => {
  const costs = getAllPreciousMetalCosts();
  const breakdown = {};
  
  Object.keys(costs).forEach(ringKey => {
    const partition = loadPreciousMetalPartition(ringKey);
    breakdown[ringKey] = {
      partitionType: partition.name,
      cost: costs[ringKey]
    };
  });
  
  return breakdown;
};

// Get groove cost breakdown for display
export const getGrooveCostBreakdown = () => {
  const costs = getAllGrooveCosts();
  const breakdown = {};
  
  Object.keys(costs).forEach(ringKey => {
    const grooveConfig = loadGrooveConfiguration(ringKey);
    const numberOfGrooves = grooveConfig.grooves ? grooveConfig.grooves.length : 0;
    
    let costPerGroove = 0;
    if (grooveConfig.type === "Milgrain") {
      costPerGroove = grooveStepPricingConfig.groove.milgrain;
    } else if (grooveConfig.type !== "Without") {
      costPerGroove = grooveStepPricingConfig.groove.regular;
    }
    
    breakdown[ringKey] = {
      grooveType: grooveConfig.type,
      numberOfGrooves: numberOfGrooves,
      costPerGroove: costPerGroove,
      totalCost: costs[ringKey]
    };
  });
  
  return breakdown;
};

// Get step cost breakdown for display
export const getStepCostBreakdown = () => {
  const costs = getAllStepCosts();
  const breakdown = {};
  
  Object.keys(costs).forEach(ringKey => {
    const stepConfig = loadStepConfiguration(ringKey);
    
    let leftCost = 0;
    let rightCost = 0;
    
    if (stepConfig.left === "Milgrain") {
      leftCost = grooveStepPricingConfig.step.milgrain;
    } else if (stepConfig.left === "Step") {
      leftCost = grooveStepPricingConfig.step.regular;
    }
    
    if (stepConfig.right === "Milgrain") {
      rightCost = grooveStepPricingConfig.step.milgrain;
    } else if (stepConfig.right === "Step") {
      rightCost = grooveStepPricingConfig.step.regular;
    }
    
    breakdown[ringKey] = {
      leftStep: stepConfig.left,
      rightStep: stepConfig.right,
      leftCost: leftCost,
      rightCost: rightCost,
      totalCost: costs[ringKey]
    };
  });
  
  return breakdown;
};

// Get stone cost breakdown for display
export const getStoneCostBreakdown = () => {
  const costs = getAllStoneCosts();
  const breakdown = {};
  
  Object.keys(costs).forEach(ringKey => {
    const stoneDetails = [];
    let totalCost = 0;
    
    // Check all possible stone tabs
    for (let tabId = 1; tabId <= 10; tabId++) {
      const stoneConfig = loadStoneConfiguration(ringKey, tabId);
      
      if (stoneConfig.style !== "Without") {
        let stoneCost = 0;
        
        const styleCost = stonePricingConfig.stoneStyles[stoneConfig.style] || 0;
        const typeCost = stonePricingConfig.stoneTypes[stoneConfig.type] || 0;
        const sizeCost = stonePricingConfig.stoneSizes[stoneConfig.size] || 0;
        const numberOfStones = parseInt(stoneConfig.number) || 1;
        
        stoneCost = (styleCost + typeCost + sizeCost) * numberOfStones;
        totalCost += stoneCost;
        
        stoneDetails.push({
          tabId: tabId,
          style: stoneConfig.style,
          type: stoneConfig.type,
          size: stoneConfig.size,
          number: numberOfStones,
          styleCost: styleCost,
          typeCost: typeCost,
          sizeCost: sizeCost,
          totalStoneCost: stoneCost
        });
      }
    }
    
    breakdown[ringKey] = {
      stoneDetails: stoneDetails,
      totalCost: totalCost
    };
  });
  
  return breakdown;
};

// Helper function to format price with euro symbol
export const formatPrice = (price) => {
  return `${price} €`;
}; 