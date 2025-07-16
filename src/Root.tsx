import React, { useState, useEffect } from "react";
import { LoginComponent } from "./components/LoginComponent";
import { App } from "./App";
import { createGlobalStyle } from "styled-components";
import { ConfigProvider, theme as antdTheme, Modal } from "antd";
import {
  getInitialTheme,
  THEME_KEY,
  AppContext,
  type ThemeOption,
  type UserDataType,
} from "./context/app";
import { ThemeToggleButton } from "./components/ThemeToggleButton";

const GlobalStyle = createGlobalStyle`
  body {
    background: var(--background-color);
    color: var(--text-color);
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  .mono {
    font-family: monospace;
  }
  .override-menu.ant-menu{
    .ant-menu-item-extra {
      width: 100%;
      margin-inline-start: 0;
      padding-inline-start: 0;
    }
  }
  .theme-dark .react-grid-item > .react-resizable-handle::after {
    border-right: 2px solid rgb(255 255 255 / 40%);
    border-bottom: 2px solid rgba(255 255 255 / 40%);
  }

  .react-grid-item.react-grid-placeholder {
    opacity: 1;
    background-color: rgba(126,199,255,0.32); /* Light blue with transparency */
    border: 2.5px dashed #7ec7ff; /* Dashed blue border */
    border-radius: 8px; /* Slightly rounded corners */
    transition: background 0.1s, border 0.1s; /* Smooth transition on hover/drag */
  }
`;

const isLoggedIn = (): boolean => localStorage.getItem("isLoggedIn") === "true";

const Root: React.FC = () => {
  const [theme, setTheme] = useState<ThemeOption | null>(getInitialTheme());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserDataType>();

  const handleOk = () => {
    if(!theme) setTheme(theme ?? "light");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    if(!theme) setTheme(theme ?? "light");
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!theme || theme === "null") {
      setIsModalOpen(true);
    }
    localStorage.setItem(THEME_KEY, theme ?? "null");
  }, [theme]);
  return (
    <AppContext.Provider
      value={{
        theme: theme ?? "dark",
        setTheme,
        loggedIn,
        setLoggedIn,
        userData,
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: theme === "dark" ? "#232b3e" : "#F5F5F5",
            colorWarning: "#ffb300",
            colorError: "#e57373",
            colorPrimary: "#7c5fe6",
            colorInfo: "#7c5fe6",
          },
          components: {
            Typography: {
              fontFamilyCode: "'Segoe UI', Arial, sans-serif",
            },
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
          <LoginComponent
            onLoginSuccess={(u) => {
              setUserData(u);
              setLoggedIn(true);
            }}
          />
        )}
      </ConfigProvider>
      <Modal
        title="Theme Selection"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ThemeToggleButton
          onThemeToggle={(checked) => setTheme(checked ? "dark" : "light")}
          theme={theme ?? "null"}
        />
      </Modal>
    </AppContext.Provider>
  );
};

export default Root;
