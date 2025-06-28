import React, { useState } from "react";
import type { FC, DragEvent } from "react";
import { ThemeContext } from "./context/theme";
import AboutIcon from "./Icons/AboutIcon";
import TermsIcon from "./Icons/TermsIcon";
import FruitViewIcon from "./Icons/FruitViewIcon";
import UserProfile from "./components/UserProfile";
import { panelList } from "./panels/panelList";
import AboutPanel from "./panels/AboutPanel";
import FruitBookPanel from "./panels/FruitBookPanel";
import { FruitViewPanel } from "./panels/FruitViewPanel";

import { Responsive, WidthProvider, type Layouts } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Card } from "antd";
import { produce } from "immer";
import { CloseOutlined, DragOutlined } from "@ant-design/icons";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
/**
 * Represents an open panel's state and position.
 */
type OpenPanel = {
  id: string;
  key: string;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
};

interface Widget {
  key: string;
  id: string;
}

/**
 * Main application component.
 */
export const App: FC = () => {
  const [openPanels, setOpenPanels] = useState<OpenPanel[]>([]);
  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dropCell, setDropCell] = useState<{ row: number; col: number } | null>(
    null
  );
  const [layouts, setLayouts] = useState<Layouts>({ xxs: [] });
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const { theme, setTheme, setLoggedIn } = React.useContext(ThemeContext);
  // const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme());

  // Drag from nav: set key in dataTransfer
  /**
   * Handles drag start from the navigation bar.
   * @param key Panel key
   */
  const onNavDragStart = (key: string) => (e: DragEvent<HTMLLIElement>) => {
    setDragNavPanelKey(key);
    e.dataTransfer.setData("panelKey", key);
  };

  /**
   * Closes a panel by id.
   */
  const handleClose = (id: string) => {
    setOpenPanels(openPanels.filter((p) => p.id !== id));
  };

  /**
   * Moves a panel by delta x and y.
   */
  const handlePanelMove = (id: string, dx: number, dy: number) => {
    setOpenPanels((panels) =>
      panels.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p))
    );
  };

  /**
   * Resizes a panel by delta width and height.
   */
  const handlePanelResize = (id: string, dw: number, dh: number) => {
    setOpenPanels((panels) =>
      panels.map((p) =>
        p.id === id
          ? {
              ...p,
              width: Math.max(200, p.width + dw),
              height: Math.max(100, p.height + dh),
            }
          : p
      )
    );
  };

  // Inactivity logout timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("login-success"));
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ["mousemove", "keydown", "mousedown", "touchstart"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Navigation Bar */}
      {navOpen && (
        <nav
          style={{
            width: 90, // Increased width
            background: "#232b3e",
            padding: "0.5rem 0.25rem",
            borderRight: "1px solid #3e4a6b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 90, // Increased minWidth
            boxSizing: "border-box",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {panelList.map((panel) => (
              <li
                key={panel.key}
                style={{
                  marginBottom: 16,
                  cursor: "grab",
                  fontWeight: "normal",
                  background:
                    dragNavPanelKey === panel.key ? "#353b4a" : undefined,
                  padding: 8,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#e0e0e0",
                  width: "100%",
                  transition: "background 0.2s",
                  textAlign: "center", // Center text
                  minHeight: 64,
                }}
                draggable
                onDragStart={onNavDragStart(panel.key)}
                onDragEnd={() => setDragNavPanelKey(null)}
                title={panel.title}
              >
                <span style={{ marginBottom: 4 }}>
                  {panel.key === "fruitbook" ? (
                    <TermsIcon />
                  ) : panel.key === "fruitview" ? (
                    <FruitViewIcon />
                  ) : panel.key === "about" ? (
                    <AboutIcon />
                  ) : null}
                </span>
                <span
                  style={{
                    width: "100%",
                    textAlign: "center", // Center text
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {panel.title}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {/* Panel Area */}

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          // background: "#232b3e",
          overflow: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        {/* Top nav branding */}
        <div
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #2b3556 0%, #3e4a6b 100%)",
            color: "#fff",
            padding: "0.5rem 1.5rem",
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: 1,
            position: "sticky",
            top: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 8px #0002",
            minHeight: NAV_BAR_HEIGHT,
            borderBottom: "1px solid #3e4a6b",
          }}
        >
          {/* Hamburger/X icon */}
          <button
            onClick={() => setNavOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 26,
              cursor: "pointer",
              marginRight: 20,
              display: "flex",
              alignItems: "center",
              padding: 0,
              height: 40,
              width: 40,
              borderRadius: 8,
              transition: "background 0.2s",
              boxShadow: navOpen ? "0 2px 8px #0002" : undefined,
            }}
            aria-label="Toggle navigation"
          >
            <span style={{ display: "inline-block", width: 28, height: 28 }}>
              {navOpen ? (
                // X icon
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <line
                    x1="7"
                    y1="7"
                    x2="21"
                    y2="21"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="21"
                    y1="7"
                    x2="7"
                    y2="21"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <rect y="6" width="28" height="3" rx="1.5" fill="#fff" />
                  <rect y="13" width="28" height="3" rx="1.5" fill="#fff" />
                  <rect y="20" width="28" height="3" rx="1.5" fill="#fff" />
                </svg>
              )}
            </span>
          </button>
          {/* App title */}
          <span
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 2,
              color: "#fff",
              textShadow: "0 1px 2px #0006",
              userSelect: "none",
              textTransform: "uppercase",
            }}
          >
            fruteria
          </span>
          {/* Spacer to push UserProfile to the right */}
          <div style={{ flex: 1 }} />
          {/* UserProfile on the right */}
          <div style={{ marginRight: 32 }}>
            <UserProfile
              onLogout={() => {
                localStorage.removeItem("isLoggedIn");
                setLoggedIn(false);
              }}
              onThemeToggle={(checked) => setTheme(checked ? "dark" : "light")}
              theme={theme}
            />
          </div>
        </div>
        <ResponsiveReactGridLayout
          isDroppable
          draggableHandle=".drag-handle"
          rowHeight={70}
          layouts={layouts}
          onDropDragOver={() => ({ w: 6, h: 5 })}
          breakpoints={{ xxs: 0 }}
          cols={{ xxs: 12 }}
          measureBeforeMount={false}
          onDrop={(layout, item, e) => {
            const event = e as unknown as DragEvent;
            const id = `${Date.now()}`;
            const panelType = event.dataTransfer.getData("panelKey");
            const newItem = { ...item, i: id };
            console.log(layout);
            setLayouts((prev) => ({
              xxs: [...prev.xxs, newItem],
            }));
            setWidgets((prev) => [...prev, { id, key: panelType }]);
          }}
          style={{ flex: 1 }}
        >
          {widgets.map((w) => {
            const mapToComp: Record<string, React.ReactNode> = {
              fruitbook: <FruitBookPanel />,
              fruitview: <FruitViewPanel />,
              about: <AboutPanel />,
            };
            const mapToTitle: Record<string, string> = {
              fruitbook: "Fruit Book",
              fruitview: "Fruit View",
              about: "About",
            };
            return (
              <div key={w.id} style={{ overflow: "hidden" }}>
                <Card
                  size="small"
                  style={{ height: "100%" }}
                  title={mapToTitle[w.key]}
                  extra={
                    <>
                      <CloseOutlined
                        onClick={() => {
                          setWidgets((prev) => {
                            const newW = produce(prev, (draft) =>
                              draft.filter((o) => o.id !== w.id)
                            );
                            return newW;
                          });
                          setLayouts((prev) => {
                            const newW = produce(prev.xxs, (draft) =>
                              draft.filter((o) => o.i !== w.id)
                            );
                            return { xxs: newW };
                          });
                        }}
                      />
                      <DragOutlined
                        style={{ marginLeft: 10, cursor: "grab" }}
                        className="drag-handle"
                      />
                    </>
                  }
                  styles={{
                    body: {
                      height: "calc(100% - 38px)",
                    },
                  }}
                >
                  {mapToComp[w.key]}
                </Card>
              </div>
            );
          })}
        </ResponsiveReactGridLayout>
        {openPanels.length === 0 ? (
          <div
            style={{ color: "#888", textAlign: "center", marginTop: "2rem" }}
          >
            No panels open.
            <br />
            Drag one from the navigation bar.
          </div>
        ) : (
          openPanels.map((panel) => (
            <ResizableDraggablePanel
              {...panel}
              onClose={() => handleClose(panel.id)}
              onMove={(dx, dy) => handlePanelMove(panel.id, dx, dy)}
              onResize={(dw, dh) => handlePanelResize(panel.id, dw, dh)}
              // Add a prop to indicate dragging for overlay z-index if needed
            />
          ))
        )}
      </main>
    </div>
  );
};

const NAV_BAR_HEIGHT = 56; // px, must match your nav bar minHeight

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

const GRID_ROWS = 2;
const GRID_COLS = 2;
/**
 * Calculates the position and size of a grid cell.
 * @param row Row index
 * @param col Column index
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @param navBarHeight Height of the navigation bar
 */
const getGridCellPosition = (
  row: number,
  col: number,
  containerWidth: number,
  containerHeight: number,
  navBarHeight: number
) => {
  const cellWidth = containerWidth / GRID_COLS;
  const cellHeight = containerHeight / GRID_ROWS;
  return {
    x: Math.round(col * cellWidth),
    y: Math.round(row * cellHeight + navBarHeight),
    width: Math.round(cellWidth),
    height: Math.round(cellHeight),
  };
};

const dummy: FC<Record<string, any>> = () => null;
const ResizableDraggablePanel = dummy;
