import { UserPopover } from "./UserPopover";
import { render, screen } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";

describe("<UserPopover />", () => {
  it("should render", async () => {
    const user = UserEvent.setup();
    const onThemeSpy = jest.fn();
    const onCancel = jest.fn();
    const onLogout = jest.fn();
    const { rerender } = render(
      <UserPopover
        onCancel={onCancel}
        onLogout={onLogout}
        userInfo={{ name: "name", email: "email" }}
        onThemeToggle={onThemeSpy}
        theme="dark"
      />
    );
    const button = screen.getByRole("button", {
      name: /log out/i,
    });
    await user.click(button);
    expect(onCancel).toHaveBeenCalled();
    expect(onLogout).toHaveBeenCalled();
    rerender(
      <UserPopover
        onCancel={onCancel}
        onLogout={onLogout}
        userInfo={{ name: "name", email: "email" }}
        onThemeToggle={onThemeSpy}
        theme="light"
      />
    );
  });
});
