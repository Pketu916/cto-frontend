/**
 * Pricing utilities for Australian states, days, and time-based pricing
 */

// Australian states
export const AUSTRALIAN_STATES = [
  { value: "ACT", label: "Australian Capital Territory (ACT)" },
  { value: "NSW", label: "New South Wales (NSW)" },
  { value: "NT", label: "Northern Territory (NT)" },
  { value: "QLD", label: "Queensland (QLD)" },
  { value: "SA", label: "South Australia (SA)" },
  { value: "TAS", label: "Tasmania (TAS)" },
  { value: "VIC", label: "Victoria (VIC)" },
  { value: "WA", label: "Western Australia (WA)" },
];

/**
 * Format price in Australian Dollar (AUD)
 * @param {number} price - Price amount
 * @param {object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatAUD = (price, options = {}) => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showCurrency = true,
  } = options;

  if (price === null || price === undefined || isNaN(price)) {
    return showCurrency ? "A$0.00" : "0.00";
  }

  const formatted = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);

  return formatted;
};

/**
 * Get day type from date (regular, saturday, sunday)
 * @param {Date} date - Date object
 * @returns {string} Day type
 */
export const getDayType = (date) => {
  if (!date) return "regular";
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 6) return "saturday";
  if (dayOfWeek === 0) return "sunday";
  return "regular";
};

/**
 * Check if time is night (8 PM to 6 AM)
 * @param {string} time - Time in HH:mm format
 * @returns {boolean} True if night time
 */
export const isNightTime = (time) => {
  if (!time) return false;
  const hour = parseInt(time.split(":")[0], 10);
  return hour >= 20 || hour < 6;
};

/**
 * Get price condition based on day and time
 * @param {Date} date - Booking date
 * @param {string} time - Booking time in HH:mm format
 * @returns {string} Price condition (regular, saturday, sunday, or night)
 */
export const getPriceCondition = (date, time) => {
  if (!date) return "regular";

  // Night takes priority
  if (time && isNightTime(time)) {
    return "night";
  }

  return getDayType(date);
};

/**
 * Get price from service conditions
 * @param {object} service - Service object with conditions
 * @param {string} state - Australian state code
 * @param {Date} date - Booking date
 * @param {string} time - Booking time in HH:mm format
 * @returns {number|null} Price or null if not found
 */
export const getServicePrice = (service, state, date, time) => {
  if (!service || !service.conditions) {
    return null;
  }

  const condition = getPriceCondition(date, time);
  const conditionPrices = service.conditions[condition];

  if (!conditionPrices) {
    // Fallback to regular if condition doesn't exist
    const regularPrices = service.conditions.regular;
    if (!regularPrices) return null;
    return regularPrices[state]?.price || regularPrices.default?.price || null;
  }

  // Get price for state or default
  const statePrice = conditionPrices[state]?.price;
  if (statePrice !== undefined && statePrice !== null) {
    return statePrice;
  }

  // Fallback to default price
  return conditionPrices.default?.price || null;
};

/**
 * Get price range for a service across all conditions
 * @param {object} service - Service object with conditions
 * @param {string} state - Australian state code (optional)
 * @returns {object} Min and max price
 */
export const getPriceRange = (service, state = null) => {
  if (!service || !service.conditions) {
    return { min: null, max: null };
  }

  const prices = [];
  const conditions = ["regular", "saturday", "sunday", "night"];

  conditions.forEach((condition) => {
    const conditionPrices = service.conditions[condition];
    if (!conditionPrices) return;

    if (state && conditionPrices[state]?.price !== undefined) {
      prices.push(conditionPrices[state].price);
    } else if (conditionPrices.default?.price !== undefined) {
      prices.push(conditionPrices.default.price);
    }
  });

  if (prices.length === 0) {
    return { min: null, max: null };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

/**
 * Format price range for display
 * @param {object} service - Service object
 * @param {string} state - Australian state code (optional)
 * @returns {string} Formatted price range string
 */
export const formatPriceRange = (service, state = null) => {
  const range = getPriceRange(service, state);
  if (!range.min && !range.max) {
    return "Contact for pricing";
  }

  if (range.min === range.max) {
    return formatAUD(range.min);
  }

  return `${formatAUD(range.min)} - ${formatAUD(range.max)}`;
};

