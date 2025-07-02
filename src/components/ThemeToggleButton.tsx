import { MoonFilled, SunFilled } from "@ant-design/icons";
import { Switch } from "antd";
import styled from "styled-components";
import type { ThemeOption } from "../context/app";

const ThemeSwitch = styled.div`
  display: flex;
  margin-left: 8px;
  margin-top: 16px;
  .text {
    margin-left: 8px; 
    font-size: 14px;
  }
`;
export const ThemeToggleButton: React.FC<{
  onThemeToggle: (checked: boolean) => void;
  theme: ThemeOption;
}> = ({ onThemeToggle, theme }) => (
  <ThemeSwitch>
    <Switch
      checkedChildren={<MoonFilled />}
      unCheckedChildren={<SunFilled />}
      checked={theme === "dark"}
      onChange={onThemeToggle}
      defaultChecked
    />
    <span className="text">
      {theme === "dark" ? "Dark" : "Light"} Theme
    </span>
  </ThemeSwitch>
);