import React, { ReactNode } from "react";
import { ConfigProvider } from "antd";

type ThemeMode = "light" | "dark";

interface ThemeProviderProps {
  mode: ThemeMode;
  children: ReactNode;
}

export const ThemeProvider = ({ mode, children }: ThemeProviderProps) => {
  // Theme switching not supported in v4, just render children
  return <ConfigProvider>{children}</ConfigProvider>;
};
