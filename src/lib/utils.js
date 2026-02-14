import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function calculateAspectRatio(width, height) {
  if (width <= 0 || height <= 0) return { w: 0, h: 0 };
  const divisor = gcd(width, height);
  return { w: width / divisor, h: height / divisor };
}

export function calculateTargetSize(originalWidth, originalHeight, targetValue, mode) {
  if (originalWidth === 0 || originalHeight === 0) return null;
  
  if (mode === "width") {
    return Math.round((targetValue / originalWidth) * originalHeight);
  } else {
    return Math.round((targetValue / originalHeight) * originalWidth);
  }
}
