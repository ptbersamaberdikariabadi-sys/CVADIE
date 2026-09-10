import { describe, it, expect } from 'vitest';
import { generateSlug, generateTitleFromSlug } from '@/utils/slugify';

describe('slugify utility', () => {
  describe('generateSlug', () => {
    it('should generate a valid slug from a string', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('  Hello   World  ')).toBe('hello-world');
    });

    it('should replace & with dan', () => {
      expect(generateSlug('Mac & Cheese')).toBe('mac-dan-cheese');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello, World! 123')).toBe('hello-world-123');
    });

    it('should return empty string if input is falsy', () => {
      expect(generateSlug('')).toBe('');
      // @ts-expect-error Testing invalid input
      expect(generateSlug(null)).toBe('');
    });
  });

  describe('generateTitleFromSlug', () => {
    it('should generate a title from a valid slug', () => {
      expect(generateTitleFromSlug('hello-world')).toBe('Hello World');
    });

    it('should replace dan with &', () => {
      expect(generateTitleFromSlug('mac-dan-cheese')).toBe('Mac & Cheese');
    });

    it('should return empty string if input is falsy', () => {
      expect(generateTitleFromSlug('')).toBe('');
    });
  });
});
