/**
 * Sync marketplace price mapper for FRE placements.
 * Pure function — no fetch, logging, or analytics.
 */

function isPresent(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function assertVehicleModelId(vehicleModelId) {
  if (typeof vehicleModelId !== 'string' || vehicleModelId.trim() === '') {
    throw new TypeError('vehicleModelId is required');
  }
}

/**
 * @param {object} input
 * @param {string} input.vehicleModelId
 * @param {boolean} input.inFlight
 * @param {boolean} input.readFailed
 * @param {number|null|undefined} input.low
 * @param {number|null|undefined} input.high
 * @param {'hero-range'|'starting-at'} input.copyVariant
 * @param {string} input.originalMsrpCopy
 * @param {(amount: number) => string} input.formatDollars — must include leading $
 * @returns {{ hide: boolean, display: string|null }}
 */
export function mapMarketplacePrice({
  vehicleModelId,
  inFlight,
  readFailed,
  low,
  high,
  copyVariant,
  originalMsrpCopy,
  formatDollars,
}) {
  assertVehicleModelId(vehicleModelId);
  // Identity validated then discarded — not returned, stored, or logged.

  if (inFlight) {
    return { hide: true, display: null };
  }

  if (readFailed) {
    return { hide: false, display: originalMsrpCopy };
  }

  const bothPresent = isPresent(low) && isPresent(high);

  if (bothPresent && copyVariant === 'hero-range') {
    return {
      hide: false,
      display: `Marketplace  ${formatDollars(low)} - ${formatDollars(high)}`,
    };
  }

  if (bothPresent && copyVariant === 'starting-at') {
    return {
      hide: false,
      display: `starting at ${formatDollars(low)}`,
    };
  }

  return { hide: false, display: originalMsrpCopy };
}
