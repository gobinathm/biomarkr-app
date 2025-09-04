import { isValidClientId } from '../providerValidation';

describe('Provider Validation', () => {
  describe('isValidClientId', () => {
    it('should reject demo values', () => {
      expect(isValidClientId('demo-client-id')).toBe(false);
      expect(isValidClientId('demo-onedrive-client-id')).toBe(false);
    });

    it('should reject placeholder values', () => {
      expect(isValidClientId('your-client-id')).toBe(false);
      expect(isValidClientId('your-onedrive-client-id')).toBe(false);
      expect(isValidClientId('your-google-client-id')).toBe(false);
    });

    it('should reject short values', () => {
      expect(isValidClientId('abc123')).toBe(false);
      expect(isValidClientId('short')).toBe(false);
    });

    it('should reject undefined/empty values', () => {
      expect(isValidClientId(undefined)).toBe(false);
      expect(isValidClientId('')).toBe(false);
    });

    it('should accept valid client IDs', () => {
      expect(isValidClientId('abc123def456ghi789')).toBe(true);
      expect(isValidClientId('real-client-id-from-provider')).toBe(true);
      expect(isValidClientId('1234567890abcdef')).toBe(true);
    });

    it('should reject common placeholder patterns', () => {
      expect(isValidClientId('xxxxxxxxxxxxxxxx')).toBe(false);
      expect(isValidClientId('test-client-id')).toBe(false);
      expect(isValidClientId('example-client-id')).toBe(false);
      expect(isValidClientId('placeholder-value')).toBe(false);
    });
  });
});