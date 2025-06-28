import React, { useState, useEffect } from "react";
import { LoginComponent } from "./components/LoginComponent";
import { App } from "./App";
import { createGlobalStyle } from "styled-components";
import { ConfigProvider, theme as antdTheme } from "antd";
import {
  getInitialTheme,
  THEME_KEY,
  AppContext,
  type ThemeOption,
} from "./context/app";

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
    --background-color: #232b3e;
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

  .react-grid-item.react-grid-placeholder {
    opacity: 1;
    background-color: rgba(126,199,255,0.32); /* Light blue with transparency */
    border: 2.5px dashed #7ec7ff; /* Dashed blue border */
    border-radius: 8px; /* Slightly rounded corners */
    transition: background 0.1s, border 0.1s; /* Smooth transition on hover/drag */
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
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <AppContext.Provider value={{ theme, setTheme, loggedIn, setLoggedIn }}>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              bodyPaddingSM: 0,
            },
          },
          token: {
            colorBgBase: theme === "dark" ? "#232b3e" : "#F5F5F5",
          },
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
    </AppContext.Provider>
  );
};

export default Root;
