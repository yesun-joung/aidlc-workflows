import { describe, it, expect } from 'vitest';
import { mapMarketplacePrice } from './map-marketplace-price.js';

const formatDollars = (n) => `$${String(n)}`;
const base = {
  vehicleModelId: 'kia_niro',
  inFlight: false,
  readFailed: false,
  low: 10000,
  high: 20000,
  copyVariant: 'starting-at',
  originalMsrpCopy: 'MSRP $30,000',
  formatDollars,
};

describe('mapMarketplacePrice', () => {
  it('hides while inFlight', () => {
    expect(mapMarketplacePrice({ ...base, inFlight: true })).toEqual({
      hide: true,
      display: null,
    });
  });

  it('treats 0 as present for marketplace copy', () => {
    expect(
      mapMarketplacePrice({
        ...base,
        low: 0,
        high: 0,
        copyVariant: 'starting-at',
      }),
    ).toEqual({ hide: false, display: 'starting at $0' });
  });

  it('does not coerce string low/high into marketplace copy', () => {
    expect(
      mapMarketplacePrice({
        ...base,
        low: '10000',
        high: '20000',
        copyVariant: 'hero-range',
      }),
    ).toEqual({ hide: false, display: 'MSRP $30,000' });
  });

  it('falls back to Original MSRP when one side is missing', () => {
    expect(
      mapMarketplacePrice({ ...base, low: 10000, high: null }),
    ).toEqual({ hide: false, display: 'MSRP $30,000' });
  });

  it('falls back to Original MSRP when readFailed', () => {
    expect(mapMarketplacePrice({ ...base, readFailed: true })).toEqual({
      hide: false,
      display: 'MSRP $30,000',
    });
  });

  it('throws TypeError for blank vehicleModelId', () => {
    expect(() =>
      mapMarketplacePrice({ ...base, vehicleModelId: '   ' }),
    ).toThrow(TypeError);
    expect(() =>
      mapMarketplacePrice({ ...base, vehicleModelId: null }),
    ).toThrow(TypeError);
  });

  it('builds hero-range marketplace string', () => {
    expect(
      mapMarketplacePrice({
        ...base,
        copyVariant: 'hero-range',
        low: 12000,
        high: 18000,
      }),
    ).toEqual({
      hide: false,
      display: 'Marketplace  $12000 - $18000',
    });
  });

  it('builds starting-at marketplace string', () => {
    expect(
      mapMarketplacePrice({
        ...base,
        copyVariant: 'starting-at',
        low: 15000,
        high: 22000,
      }),
    ).toEqual({ hide: false, display: 'starting at $15000' });
  });
});
