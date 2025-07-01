import { render, screen, act } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import { App, ResponsiveReactGridLayout as rggl } from "./App";
import up from "./components/UserProfile";

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

const ResponsiveReactGridLayout = rggl as unknown as jest.Mock;
const UserProfile = up as unknown as jest.Mock;

jest.mock("react-grid-layout", () => ({
  Responsive: "",
  WidthProvider: () =>
    jest.fn().mockImplementation(({ children }) => (
      <main>
        WidthProvider
        <div>{children}</div>
      </main>
    )),
}));

jest.mock("./components/UserProfile", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div>UserProfile</div>),
}));

describe("<App />", () => {
  it("should render without error", async () => {
    const user = UserEvent.setup();
    render(<App />);
    expect(UserProfile).toHaveBeenCalled();
    const [{ onLogout, onThemeToggle }] = UserProfile.mock.lastCall ?? [];
    expect(onLogout).toBeTruthy();
    expect(onThemeToggle).toBeTruthy();
    onLogout();
    onThemeToggle(true);
    onThemeToggle(false);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation/i,
    });
    await user.click(toggle);
    expect(ResponsiveReactGridLayout).toHaveBeenCalled();
    const [{ onDropDragOver, onDrop }] =
      ResponsiveReactGridLayout.mock.lastCall ?? [];
    expect(onDropDragOver).toBeDefined();
    expect(onDrop).toBeDefined();
    expect(onDropDragOver()).toBeTruthy();
    const item = {
      w: 6,
      h: 5,
      x: 0,
      y: 0,
      i: "__dropping-elem__",
      moved: false,
      static: false,
      isDraggable: true,
    };
    act(() =>
      onDrop([], item, { dataTransfer: { getData: () => "fruitview" } })
    );
    // debug(undefined, 30000);
    const close = screen.getByTestId("close");
    await user.click(close);
  });
});
