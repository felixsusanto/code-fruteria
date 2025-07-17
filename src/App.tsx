import React, { useState } from "react";
import type { DragEvent } from "react";
import { AppContext } from "./context/app";
import AboutIcon from "./Icons/AboutIcon";
import TermsIcon from "./Icons/TermsIcon";
import FruitViewIcon from "./Icons/FruitViewIcon";
import AboutPanel from "./panels/AboutPanel";
import { FruitBook } from "./panels/FruitBookPanel";
import { FruitViewPanel } from "./panels/FruitViewPanel";
import fruitLady from "./assets/images/avatar2.png";
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
  Space,
  Tag,
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
import { CandlestickChart, fruitBase } from "./components/CandlestickChart";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { FullHeightWrapper } from "./components/UtilityComponent";
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import LivePricePanel from "./panels/LivePricePanel";
import Marquee from "react-fast-marquee";
import type { FruitName } from "./types/fruit";

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

export const App: React.FC = () => {
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
      boxShadow,
      colorTextSecondary
    },
  } = theme.useToken();
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
            <LogoutOutlined /> Log Out
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
    width: 300,
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
              {
                key: "5",
                icon: <SlidersTwoTone />,
                extra: (
                  <ExtraElement
                    isDragged={dragNavPanelKey === "live"}
                    onDragStart={onNavDragStart("live")}
                    onDragEnd={onDragEnd}
                    title="Live Price"
                    id="live"
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
                    marginRight: 8,
                  }}
                />
                <Typography.Text
                  className="mono"
                  strong
                  style={{ fontSize: fontSizeHeading4 }}
                >
                  🍌 FRUTERIA 2.0
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
                    <div style={{...contentStyle, padding: 8}}>
                      <Flex align="center" style={{ padding: 8 }}>
                        <Avatar
                          size={52}
                          src={<img src={fruitLady} />}
                          style={{ marginRight: 8 }}
                        />
                        <Space style={{ padding: 0 }} direction="vertical">
                          <Typography.Text>
                            Welcome, <strong>{userData?.user}</strong><br />
                            <span style={{color: colorTextSecondary}}>{userData?.email}</span>
                          </Typography.Text>
                        </Space>
                      </Flex>

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
                  <Avatar size={"default"} src={<img src={fruitLady} />} style={{ cursor: "pointer"}} />
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
                onLayoutChange={(_, layouts) => setLayouts(layouts)}
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
                    live: <LivePricePanel />,
                  };
                  const mapToTitle: Record<string, string> = {
                    fruitbook: "Fruit Book",
                    fruitview: "Fruit View",
                    historic: "Historic Price",
                    about: "About",
                    live: "Live Price",
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
          <Footer
            style={{ background: colorBgContainer, boxShadow: boxShadow }}
          >
            <Ticker />
          </Footer>
        </Layout>
      </Layout>
    </FullHeightWrapper>
  );
};

const news: Record<FruitName, string> = {
  Apple: "🍎 prices soar as new varieties hit the market!",
  Banana: "🍌 prices surge as demand for smoothies skyrockets!",
  Orange: "🍊 juice sales spike during summer months.",
  Kiwi: "🥝 farmers report record yields this season.",
  Mango: "🥭 prices stabilize after last year's fluctuations.",
  Pineapple: "🍍 production faces challenges due to weather.",
  Grape: "🍇 harvest yields the sweetest fruit in decades.",
  Pear: "🍐 exports to Europe increase significantly.",
  Lime: "🍋 prices drop as supply stabilizes after drought.",
  Papaya: "🥭 growers innovate with new farming techniques.",
};

const Ticker: React.FC = () => {
  const appTheme = React.useContext(AppContext).theme;
  const { token } = theme.useToken();
  return (
    <Marquee
      gradient={false}
      direction="left"
      gradientColor={token.colorBgContainer}
      speed={30}
      style={{
        color: token.colorText,
        fontSize: token.fontSize,
        padding: "0 16px",
      }}
    >
      {Object.entries(news).map(([key, value], index) => {
        return (
          <span key={index} style={{ marginRight: 32 }}>
            <strong style={{ color: appTheme === "dark" ? token.colorWarning : token.colorPrimary }}>{key.toUpperCase()}</strong>{" "}
            <Tag color="green">AVG ${fruitBase[key as FruitName].avg}</Tag> {value}
          </span>
        );
      })}
    </Marquee>
  );
};
