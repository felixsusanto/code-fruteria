import { render, screen } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import UserProfile from "./UserProfile";

jest.mock("./UserPopover", () => ({
  UserPopover: jest.fn().mockImplementation(() => <div>UserPopover</div>),
}));

describe("UserProfile", () => {
  const onLogout = jest.fn();

  it("renders the profile button", async () => {
    const user = UserEvent.setup();
    render(<UserProfile onLogout={onLogout} />);
    const profile = screen.getByTestId("profile");
    await user.click(profile);
    const stop = screen.getByTestId("stop");
    await user.click(stop);
    const bg = screen.getByTestId("bg");
    await user.click(bg);
  });
});
