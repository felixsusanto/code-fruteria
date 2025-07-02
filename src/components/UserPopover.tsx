import React from "react";
import { Button, Typography } from "antd";
import { ThemeToggleButton } from "./ThemeToggleButton";
import type { ThemeOption } from "../context/app";
import styled from "styled-components";

interface UserPopoverProps {
  userInfo: { name: string; email: string };
  onLogout: () => void;
  onCancel: () => void;
  onThemeToggle?: (checked: boolean) => void;
  theme?: ThemeOption;
}
// Styles
const popoverContainerStyle: React.CSSProperties = {
  minWidth: 280,
  padding: 28,
  background: "#232634",
  borderRadius: 14,
  boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
  textAlign: "center",
  color: "#f5f6fa",
  border: "1px solid #2e3244",
  position: "relative",
};

const logoutButtonStyle: React.CSSProperties = {
  background: "#e74c3c",
  borderColor: "#e74c3c",
  color: "#fff",
  fontWeight: 500,
  borderRadius: 8,
};

const cancelButtonStyle: React.CSSProperties = {
  marginTop: 10,
  background: "transparent",
  border: "1px solid #35394a",
  color: "#b0b4c1",
  borderRadius: 8,
};

const dividerStyle: React.CSSProperties = {
  margin: "20px 0 16px 0",
  borderTop: "1px solid #35394a",
};

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;`
;

export const UserPopover: React.FC<UserPopoverProps> = ({
  userInfo,
  onLogout,
  onCancel,
  onThemeToggle,
  theme,
}) => (
  <div style={popoverContainerStyle}>
    <Typography.Text strong style={{ fontSize: 18, color: "#f5f6fa" }}>
      {userInfo.name}
    </Typography.Text>
    <br />
    <Typography.Text
      type="secondary"
      style={{ fontSize: 14, color: "#b0b4c1" }}
    >
      {userInfo.email}
    </Typography.Text>
    <div style={dividerStyle} />
    <div style={{ marginBottom: 16, fontSize: 15, color: "#b0b4c1" }}>
      Do you want to log out?
    </div>
    <Button
      type="primary"
      block
      style={logoutButtonStyle}
      onClick={() => {
        onCancel();
        onLogout();
      }}
    >
      Log out
    </Button>
    <Button block style={cancelButtonStyle} onClick={onCancel}>
      Cancel
    </Button>
    <FlexCenter>
      {onThemeToggle && (
        <ThemeToggleButton 
          onThemeToggle={onThemeToggle}
          theme={theme || "light"}
        />
      )}
    </FlexCenter>
  </div>
);

