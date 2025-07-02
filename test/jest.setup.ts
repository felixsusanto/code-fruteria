import "@testing-library/jest-dom";
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop) => '', // Return empty string or a default value
  }),
});