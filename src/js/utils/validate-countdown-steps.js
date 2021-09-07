/**
 * @file validate-countdown-steps.js
 * @since 4.6.0
 */

/**
 * Check if the given step is valid.
 * @param {object} step - Countdown step.
 * @returns {boolean} - Returns true if step is valid.
 */
const validateStep = function (step) {
    return step.hasOwnProperty('time') && step.hasOwnProperty('value') && Number.isInteger(step.time);
};

/**
 * Check if countdown steps are valid.
 * @param {object[]} countdown - Countdown steps.
 * @returns {boolean} - Returns true if all steps are valid.
 */
const validateCountdownSteps = function(countdown) {
    if (!Array.isArray(countdown)) {
        return false;
    }

    for (const step of countdown) {
        if (!validateStep(step)) {
            return false;
        }
    }

    return true;
};

export default validateCountdownSteps;
