import { describe, it, expect } from 'vitest';
import { gcd, calculateAspectRatio, calculateTargetSize } from '../src/lib/utils.js';

describe('gcd', () => {
  it('should return greatest common divisor', () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(100, 25)).toBe(25);
    expect(gcd(17, 13)).toBe(1);
  });

  it('should handle zero', () => {
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(gcd(-1920, 1080)).toBe(120);
    expect(gcd(1920, -1080)).toBe(120);
  });

  it('should handle decimal numbers', () => {
    expect(gcd(10.5, 5.5)).toBe(1);
  });
});

describe('calculateAspectRatio', () => {
  it('should calculate aspect ratio correctly', () => {
    expect(calculateAspectRatio(1920, 1080)).toEqual({ w: 16, h: 9 });
    expect(calculateAspectRatio(100, 100)).toEqual({ w: 1, h: 1 });
    expect(calculateAspectRatio(1920, 1080)).toEqual({ w: 16, h: 9 });
  });

  it('should return 0,0 for invalid input', () => {
    expect(calculateAspectRatio(0, 100)).toEqual({ w: 0, h: 0 });
    expect(calculateAspectRatio(100, 0)).toEqual({ w: 0, h: 0 });
    expect(calculateAspectRatio(-100, 100)).toEqual({ w: 0, h: 0 });
  });

  it('should handle prime numbers', () => {
    expect(calculateAspectRatio(17, 13)).toEqual({ w: 17, h: 13 });
  });
});

describe('calculateTargetSize', () => {
  it('should calculate height from width', () => {
    expect(calculateTargetSize(1920, 1080, 1280, 'width')).toBe(720);
    expect(calculateTargetSize(100, 50, 50, 'width')).toBe(25);
  });

  it('should calculate width from height', () => {
    expect(calculateTargetSize(1920, 1080, 720, 'height')).toBe(1280);
    expect(calculateTargetSize(100, 50, 25, 'height')).toBe(50);
  });

  it('should return null for zero dimensions', () => {
    expect(calculateTargetSize(0, 1080, 1280, 'width')).toBeNull();
    expect(calculateTargetSize(1920, 0, 1280, 'width')).toBeNull();
  });

  it('should maintain aspect ratio', () => {
    const result = calculateTargetSize(1920, 1080, 640, 'width');
    expect(result).toBe(360);
    expect(640 / result).toBeCloseTo(1920 / 1080);
  });
});
