import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  describe('String manipulation', () => {
    it('should handle empty strings', () => {
      const result = ''.trim();
      expect(result).toBe('');
    });

    it('should handle string trimming', () => {
      const result = '  test  '.trim();
      expect(result).toBe('test');
    });
  });

  describe('Array operations', () => {
    it('should handle array mapping', () => {
      const arr = [1, 2, 3];
      const result = arr.map(x => x * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should handle array filtering', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.filter(x => x > 2);
      expect(result).toEqual([3, 4, 5]);
    });

    it('should handle array reducing', () => {
      const arr = [1, 2, 3, 4];
      const sum = arr.reduce((acc, val) => acc + val, 0);
      expect(sum).toBe(10);
    });
  });

  describe('Object operations', () => {
    it('should handle object spreading', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = { ...obj1, ...obj2 };
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = Object.keys(obj);
      expect(keys).toEqual(['a', 'b', 'c']);
    });

    it('should handle object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const values = Object.values(obj);
      expect(values).toEqual([1, 2, 3]);
    });
  });

  describe('Number operations', () => {
    it('should handle number parsing', () => {
      expect(parseInt('42')).toBe(42);
      expect(parseFloat('3.14')).toBe(3.14);
    });

    it('should handle NaN checks', () => {
      expect(isNaN(NaN)).toBe(true);
      expect(isNaN(42)).toBe(false);
    });

    it('should handle infinity checks', () => {
      expect(isFinite(42)).toBe(true);
      expect(isFinite(Infinity)).toBe(false);
    });
  });

  describe('Boolean operations', () => {
    it('should handle truthy values', () => {
      expect(Boolean(1)).toBe(true);
      expect(Boolean('test')).toBe(true);
      expect(Boolean({})).toBe(true);
      expect(Boolean([])).toBe(true);
    });

    it('should handle falsy values', () => {
      expect(Boolean(0)).toBe(false);
      expect(Boolean('')).toBe(false);
      expect(Boolean(null)).toBe(false);
      expect(Boolean(undefined)).toBe(false);
      expect(Boolean(NaN)).toBe(false);
    });
  });
});
