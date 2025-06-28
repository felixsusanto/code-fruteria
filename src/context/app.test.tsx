import { getInitialTheme, THEME_KEY } from "./app";
import type { ThemeOption } from "./app";

describe("getInitialTheme", () => {
  const originalGetItem = window.localStorage.getItem;

  afterEach(() => {
    window.localStorage.getItem = originalGetItem;
    window.localStorage.clear();
  });

  it("returns 'dark' when localStorage has 'dark'", () => {
    window.localStorage.setItem(THEME_KEY, "dark");
    expect(getInitialTheme()).toBe("dark");
  });

  it("returns 'light' when localStorage has 'light'", () => {
    window.localStorage.setItem(THEME_KEY, "light");
    expect(getInitialTheme()).toBe("light");
  });

  it("returns null when localStorage does not have the key", () => {
    window.localStorage.removeItem(THEME_KEY);
    expect(getInitialTheme()).toBeNull();
  });

  it("returns the value as ThemeOption type", () => {
    window.localStorage.setItem(THEME_KEY, "dark");
    const theme = getInitialTheme();
    // Type assertion test
    const valid: ThemeOption = theme;
    expect(valid).toBe("dark");
  });
});
