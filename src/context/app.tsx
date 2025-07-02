import React from "react";

export type ThemeOption = "dark" | "light" | "null";
export const THEME_KEY = "theme"; // localStorage key
/**
 * Gets the initial theme from localStorage or prompts the user.
 * @returns {'dark' | 'light'}
 */
export const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  return stored as ThemeOption;
};
interface AppContextProps {
  theme: ThemeOption;
  setTheme: (v: ThemeOption) => void;
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}
export const AppContext = React.createContext<AppContextProps>({
  theme: "dark",
  setTheme: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
});
