import React, { useState, useEffect } from "react";
import { LoginComponent } from "./components/LoginComponent";
import { App } from "./App";
import { createGlobalStyle } from "styled-components";
import { ConfigProvider, theme as antdTheme } from "antd";
import {
  getInitialTheme,
  THEME_KEY,
  ThemeContext,
  type ThemeOption,
} from "./context/theme";

const GlobalStyle = createGlobalStyle`
  body {
    background: var(--background-color);
    color: var(--text-color);
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
    // Light Theme
  .theme-light {
    --primary-color: #4CAF50;
    --secondary-color: #FFC107;
    --background-color: #F5F5F5;
    --text-color: #333;
    --border-radius: 4px;

    background: var(--background-color);
    color: var(--text-color);
  }

  // Dark Theme
  .theme-dark {
    --primary-color: #81C784;
    --secondary-color: #FFD54F;
    --background-color: #222;
    --text-color: #F5F5F5;
    --border-radius: 4px;

    background: var(--background-color);
    color: var(--text-color);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .button {
    background: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: var(--border-radius);
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: darken(var(--primary-color), 10%);
    }
  }

  .header {
    background: var(--secondary-color);
    padding: 16px;
    border-radius: var(--border-radius);
    color: #fff;
    font-size: 1.5em;
  }
`;

/**
 * Checks if the user is logged in.
 * @returns {boolean}
 */
const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

/**
 * Root component that handles login state.
 */
const Root: React.FC = () => {
  const [theme, setTheme] = useState<ThemeOption>(getInitialTheme());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    }
  }, [loggedIn]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider
        theme={{
          algorithm:
            theme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        <GlobalStyle />
        {loggedIn ? (
          <App />
        ) : (
          <LoginComponent onLoginSuccess={() => setLoggedIn(true)} />
        )}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default Root;
