import React from "react";

export type ThemeOption = "dark" | "light";
export const THEME_KEY = "theme"; // localStorage key
/**
 * Gets the initial theme from localStorage or prompts the user.
 * @returns {'dark' | 'light'}
 */
export const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  return stored as ThemeOption;
};
interface ThemeContextProps {
  theme: ThemeOption;
  setTheme: (v: ThemeOption) => void;
}
export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: "dark",
  setTheme: () => {},
});
