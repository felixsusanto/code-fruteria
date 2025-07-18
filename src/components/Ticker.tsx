import { CaretUpFilled, CaretDownFilled } from "@ant-design/icons";
import { theme, Tag } from "antd";
import React from "react";
import Marquee from "react-fast-marquee";
import { AppContext } from "../context/app";
import { hot$ } from "../stream/livePrice";
import type { FruitName } from "../types/fruit";
import { fruitBase } from "./CandlestickChart";

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

export const Ticker: React.FC = () => {
  const appTheme = React.useContext(AppContext).theme;
  const [livePrice, setLivePrice] = React.useState<
    Record<FruitName, [price: number, isPositive: boolean]>
  >({
    Banana: [NaN, false],
    Apple: [NaN, false],
    Orange: [NaN, false],
    Kiwi: [NaN, false],
    Mango: [NaN, false],
    Pineapple: [NaN, false],
    Grape: [NaN, false],
    Pear: [NaN, false],
    Lime: [NaN, false],
    Papaya: [NaN, false],
  });
  const { token } = theme.useToken();
  React.useEffect(() => {
    const sub = hot$.subscribe((data) => {
      if (!data) return;
      const entries = data.map((o) => [
        o.name as FruitName,
        [o.value?.current ?? NaN, o.value ? o.value.delta > 0 : false],
      ]) as Array<[FruitName, [number, boolean]]>;
      setLivePrice((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });
    return () => sub.unsubscribe();
  }, []);
  return (
    <Marquee
      pauseOnHover
      gradient
      direction="left"
      gradientColor={token.colorBgContainer}
      speed={30}
      style={{
        color: token.colorText,
        fontSize: token.fontSize,
      }}
    >
      {Object.entries(news).map(([key, value], index) => {
        return (
          <span key={index} style={{ marginRight: 32 }}>
            <strong
              style={{
                color:
                  appTheme === "dark" ? token.colorWarning : token.colorPrimary,
              }}
            >
              {key.toUpperCase()}
            </strong>{" "}
            {Number.isNaN(livePrice[key as FruitName][0]) ? (
              <Tag color="green">AVG ${fruitBase[key as FruitName].avg}</Tag>
            ) : (
              <Tag color={livePrice[key as FruitName][1] ? "green" : "red"}>
                {livePrice[key as FruitName][1] ? (
                  <CaretUpFilled />
                ) : (
                  <CaretDownFilled />
                )}{" "}
                LIVE ${livePrice[key as FruitName][0].toFixed(2)}
              </Tag>
            )}{" "}
            {value.toUpperCase()}
          </span>
        );
      })}
    </Marquee>
  );
};
