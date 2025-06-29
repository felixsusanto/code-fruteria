import React, { useState } from "react";
import { Button } from "antd";
import { SmileFilled } from "@ant-design/icons";
import { UserPopover } from "./UserPopover";

// Add these props to the component's props type/interface:
interface UserProfileProps {
  onLogout: () => void;
  onThemeToggle?: (checked: boolean) => void;
  theme?: "dark" | "light";
}

// Update the component signature:
const UserProfile: React.FC<UserProfileProps> = ({
  onLogout,
  onThemeToggle,
  theme,
}) => {
  const [visible, setVisible] = useState(false);

  // You can fetch/display real user info here if available
  const userInfo = {
    name: "User",
    email: "user@email.com",
  };

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <div
      className="top-bar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* ...existing code for left/middle of top bar... */}
      <div style={{ marginLeft: "auto" }}>
        <Button
          data-testid="profile"
          shape="circle"
          icon={<SmileFilled />}
          onClick={handleOpen}
          style={{
            background: "#232634",
            border: "1px solid #35394a",
            color: "#b0b4c1",
          }}
        />
      </div>
      {visible && (
        <div
          data-testid="bg"
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(23, 25, 34, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onClick={handleClose}
        >
          <div
            data-testid="stop"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserPopover
              userInfo={userInfo}
              onLogout={onLogout}
              onCancel={handleClose}
              onThemeToggle={onThemeToggle}
              theme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
