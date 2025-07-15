import React, { useState } from "react";
import type { FC, DragEvent } from "react";
import { AppContext } from "./context/app";
import AboutIcon from "./Icons/AboutIcon";
import TermsIcon from "./Icons/TermsIcon";
import FruitViewIcon from "./Icons/FruitViewIcon";
import UserProfile from "./components/UserProfile";
import { panelList } from "./panels/panelList";
import AboutPanel from "./panels/AboutPanel";
import { FruitBook } from "./panels/FruitBookPanel";
import { FruitViewPanel } from "./panels/FruitViewPanel";
import "ag-charts-enterprise";
import { Responsive, WidthProvider, type Layouts } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Modal,
  Space,
  theme,
  Typography,
  type MenuProps,
} from "antd";
import { produce } from "immer";
import Icon, {
  CloseOutlined,
  HolderOutlined,
  LogoutOutlined,
  MenuOutlined,
  SlidersTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { CandlestickChart } from "./components/CandlestickChart";
import { Header, Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { FullHeightWrapper } from "./components/UtilityComponent";
import { ThemeToggleButton } from "./components/ThemeToggleButton";

export const ResponsiveReactGridLayout = WidthProvider(Responsive);

const GridLayoutWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

interface Widget {
  key: string;
  id: string;
}

/**
 * Main application component.
 */
export const AppOld: FC = () => {
  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [layouts, setLayouts] = useState<Layouts>({ xxs: [] });
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const { theme, setTheme, setLoggedIn } = React.useContext(AppContext);

  // Drag from nav: set key in dataTransfer
  /**
   * Handles drag start from the navigation bar.
   * @param key Panel key
   */
  const onNavDragStart = (key: string) => (e: DragEvent<HTMLLIElement>) => {
    setDragNavPanelKey(key);
    e.dataTransfer.setData("panelKey", key);
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
                  ) : panel.key === "historic" ? (
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
        {widgets.length === 0 && (
          <Info>
            No panels open.
            <br />
            Drag one from the navigation bar.
          </Info>
        )}
        <GridLayoutWrapper>
          <ResponsiveReactGridLayout
            isDroppable
            draggableHandle=".ant-card-head-title"
            rowHeight={70}
            layouts={layouts}
            onDropDragOver={() => ({ w: 6, h: 5 })}
            breakpoints={{ xxs: 0 }}
            cols={{ xxs: 12 }}
            measureBeforeMount={false}
            onDrop={(_, item, e) => {
              const event = e as unknown as DragEvent;
              const id = `${Date.now()}`;
              const panelType = event.dataTransfer.getData("panelKey");
              const newItem = { ...item, i: id };
              setLayouts((prev) => ({
                xxs: [...prev.xxs, newItem],
              }));
              setWidgets((prev) => [...prev, { id, key: panelType }]);
            }}
            style={{ flex: 1 }}
          >
            {widgets.map((w) => {
              const mapToComp: Record<string, React.ReactNode> = {
                fruitbook: <FruitBook />,
                fruitview: <FruitViewPanel />,
                historic: <CandlestickChart fruit="Banana" />,
                about: <AboutPanel />,
              };
              const mapToTitle: Record<string, string> = {
                fruitbook: "Fruit Book",
                fruitview: "Fruit View",
                historic: "Historic Price",
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
                          data-testid="close"
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
                      </>
                    }
                    styles={{
                      title: {
                        cursor: "grab",
                      },
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
        </GridLayoutWrapper>
      </main>
    </div>
  );
};

const Info = styled.div`
  color: #888;
  text-align: center;
  position: absolute;
  top: 0;
  width: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: 60px;
`;

const NAV_BAR_HEIGHT = 56; // px, must match your nav bar minHeight

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

const ExtraElementWrapper = styled.span`
  display: flex;
  width: 100%;
  cursor: grab;
  .stretch {
    flex: 1;
  }
`;

interface ExtraElementProps {
  id: string;
  title: string;
  isDragged?: boolean;
  onDragStart?: (e: DragEvent<HTMLSpanElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLSpanElement>) => void;
}

const ExtraElement: React.FC<ExtraElementProps> = (props) => {
  const {
    token: { colorPrimaryActive, borderRadiusSM },
  } = theme.useToken();
  return (
    <ExtraElementWrapper
      draggable
      style={{
        borderRadius: borderRadiusSM,
        padding: `0 ${borderRadiusSM}px`,
        background: props.isDragged ? colorPrimaryActive : undefined,
      }}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
    >
      <span className="stretch">{props.title}</span> <HolderOutlined />
    </ExtraElementWrapper>
  );
};

export const AppNew: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);
  const [layouts, setLayouts] = useState<Layouts>({ xxs: [] });
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const {
    theme: themeContext,
    setTheme,
    setLoggedIn,
    userData,
  } = React.useContext(AppContext);
  const {
    token: {
      colorBgContainer,
      fontSizeHeading4,
      paddingLG,
      colorBgElevated,
      borderRadiusLG,
      boxShadowSecondary,
    },
  } = theme.useToken();
  const items: MenuProps["items"] = React.useMemo(
    () => [
      {
        label: (
          <Button
            type="primary"
            danger
            block
            onClick={() => setLoggedIn(false)}
          >
            <LogoutOutlined />{" "}
            Log Out
          </Button>
        ),
        key: "logout",
      },
    ],
    []
  );
  const onNavDragStart = (key: string) => (e: DragEvent<HTMLSpanElement>) => {
    setDragNavPanelKey(key);
    e.dataTransfer.setData("panelKey", key);
  };
  const onDragEnd = React.useCallback(() => setDragNavPanelKey(null), []);
  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
    width: 200,
  };
  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
    backgroundColor: "none",
  };

  return (
    <FullHeightWrapper>
      <Layout style={{ height: "100%" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
        >
          <Menu
            className="override-menu"
            theme="dark"
            selectable={false}
            mode="inline"
            items={[
              {
                key: "1",
                icon: <Icon component={TermsIcon as any} />,
                extra: (
                  <ExtraElement
                    isDragged={dragNavPanelKey === "fruitbook"}
                    onDragStart={onNavDragStart("fruitbook")}
                    onDragEnd={onDragEnd}
                    title="Fruit Book"
                    id="fruitbook"
                  />
                ),
              },
              {
                key: "2",
                icon: <Icon component={FruitViewIcon as any} />,
                extra: (
                  <ExtraElement
                    isDragged={dragNavPanelKey === "fruitview"}
                    onDragStart={onNavDragStart("fruitview")}
                    onDragEnd={onDragEnd}
                    title="Fruit View"
                    id="fruitview"
                  />
                ),
              },
              {
                key: "3",
                icon: <Icon component={AboutIcon as any} />,
                extra: (
                  <ExtraElement
                    isDragged={dragNavPanelKey === "about"}
                    onDragStart={onNavDragStart("about")}
                    onDragEnd={onDragEnd}
                    title="About"
                    id="about"
                  />
                ),
              },
              {
                key: "4",
                icon: <SlidersTwoTone />,
                extra: (
                  <ExtraElement
                    isDragged={dragNavPanelKey === "historic"}
                    onDragStart={onNavDragStart("historic")}
                    onDragEnd={onDragEnd}
                    title="Price History"
                    id="historic"
                  />
                ),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Flex align="center" style={{ width: "100%" }}>
              <Flex align="center" style={{ flex: 1 }}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                  }}
                />
                <Typography.Text
                  className="mono"
                  strong
                  style={{ fontSize: fontSizeHeading4 }}
                >
                  FRUTERIA
                </Typography.Text>
              </Flex>
              <Flex align="center" style={{ paddingRight: paddingLG }}>
                <ThemeToggleButton
                  theme={themeContext}
                  onThemeToggle={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  popupRender={(menu) => (
                    <div style={contentStyle}>
                      <Space style={{ padding: 8}} direction="vertical">
                        <Typography.Text>Welcome, <strong>{userData?.user}</strong></Typography.Text>
                        <Typography.Text strong type="secondary">{userData?.email}</Typography.Text>
                      </Space>
                      
                      
                      <Divider style={{ margin: 0 }} />
                      {React.cloneElement(
                        menu as React.ReactElement<{
                          style: React.CSSProperties;
                        }>,
                        { style: menuStyle }
                      )}
                    </div>
                  )}
                >
                  <Avatar size={"default"} icon={<UserOutlined />} />
                </Dropdown>
              </Flex>
            </Flex>
          </Header>
          <Content style={{ position: "relative" }}>
            {widgets.length === 0 && (
              <Info>
                No panels open.
                <br />
                Drag one from the navigation bar.
              </Info>
            )}
            <GridLayoutWrapper>
              <ResponsiveReactGridLayout
                isDroppable
                draggableHandle=".ant-card-head-title"
                rowHeight={70}
                layouts={layouts}
                onDropDragOver={() => ({ w: 6, h: 5 })}
                breakpoints={{ xxs: 0 }}
                cols={{ xxs: 12 }}
                measureBeforeMount={false}
                onDrop={(_, item, e) => {
                  const event = e as unknown as DragEvent;
                  const id = `${Date.now()}`;
                  const panelType = event.dataTransfer.getData("panelKey");
                  const newItem = { ...item, i: id };
                  setLayouts((prev) => ({
                    xxs: [...prev.xxs, newItem],
                  }));
                  setWidgets((prev) => [...prev, { id, key: panelType }]);
                }}
                style={{ flex: 1 }}
              >
                {widgets.map((w) => {
                  const mapToComp: Record<string, React.ReactNode> = {
                    fruitbook: <FruitBook />,
                    fruitview: <FruitViewPanel />,
                    historic: <CandlestickChart fruit="Banana" />,
                    about: <AboutPanel />,
                  };
                  const mapToTitle: Record<string, string> = {
                    fruitbook: "Fruit Book",
                    fruitview: "Fruit View",
                    historic: "Historic Price",
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
                              data-testid="close"
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
                          </>
                        }
                        styles={{
                          title: {
                            cursor: "grab",
                          },
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
            </GridLayoutWrapper>
          </Content>
        </Layout>
      </Layout>
    </FullHeightWrapper>
  );
};

export const App = AppNew;
