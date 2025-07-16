import { MoonFilled, SunFilled } from "@ant-design/icons";
import { Switch } from "antd";
import styled from "styled-components";
import type { ThemeOption } from "../context/app";

const ThemeSwitch = styled.div`
  display: flex;
  margin: 0 8px;
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
  </ThemeSwitch>
);