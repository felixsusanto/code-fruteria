import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import newsBanana from "../assets/images/confident-banana.png";
import newsFarmer from "../assets/images/cozy-farmer.png";
import newsLime from "../assets/images/lime-farm.png";
import newsTrader from "../assets/images/avatar.png";
import {
  Space,
  Card,
  Statistic,
  theme,
  Flex,
  Typography,
  List,
  Avatar,
  Carousel,
  Dropdown,
  type MenuProps,
  Spin,
} from "antd";
import { AgCharts } from "ag-charts-react";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/app";
import { hot$, type FruitData } from "../stream/livePrice";
import { fruitName, type FruitName } from "../types/fruit";
import type {
  AgCartesianChartOptions,
  AgAreaSeriesOptions,
} from "ag-charts-enterprise";
import { produce } from "immer";
import { formatMinutesToHoursMinutes } from "./utility";
import styled from "styled-components";

const ImgBgWrapper = styled.div<{ src: string }>`
  aspect-ratio: 1;
  width: 100%;
  background-image: url(${(p) => p.src});
  background-size: cover;
`;

const SiderContent: React.FC = () => {
  return (
    <Space direction="vertical" size="small" style={{ display: "flex" }}>
      <LiveCard />
      <Card size="small" title="Top Stories">
        <Carousel autoplay>
          <Card cover={<ImgBgWrapper src={newsBanana} />}>
            <Card.Meta
              title="Cavendish Goes All-In"
              description="Rumor has it the Cavendish variety is stacking more than potassium—players claim it’s improving poker hands"
            />
          </Card>
          <Card cover={<ImgBgWrapper src={newsFarmer} />}>
            <Card.Meta
              title="Lone Farmer Floods Market"
              description="A farmer in Pelican Town has cornered the fruit market, delivering vast quantities of apples, oranges, and mangoes with legendary quality."
            />
          </Card>
          <Card cover={<ImgBgWrapper src={newsLime} />}>
            <Card.Meta
              title="Lime Market Gets Zesty Boost"
              description="The lime juice industry is experiencing a vibrant upswing, fueled by health-conscious consumers"
            />
          </Card>
          <Card cover={<ImgBgWrapper src={newsTrader} />}>
            <Card.Meta
              title="Fruit Queen Unpeeled"
              description="She turned produce into profit and quirk into cult status—this exclusive peels back the layers of a citrus-scented empire"
            />
          </Card>
        </Carousel>
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={[
            {
              title: "🍌 Banana Prices Slip After Wild Peel Market Crash",
            },
            {
              title: "🍎 Apple Stock Takes a Bite Out of the Competition",
            },
            {
              title: "🍊 Orange You Glad Traders Are Zesting Up the Charts?",
            },
            {
              title: "🥝 Kiwi Surges After Fuzzy Forecast Goes Viral",
            },
            {
              title:
                "🥭 Mango Madness Hits Trading Floor—Sticky Situation Ahead",
            },
            {
              title: "🍍 Pineapple Spikes—Traders Say It's a Sweet Upswing",
            },
            {
              title: "🍇 Grape Expectations Met as Market Grapevine Goes Wild",
            },
            {
              title: "🍐 Pear Performance Wobbles—Traders Blame Uneven Curves",
            },
            {
              title:
                "🍈 Lime Market Gets Zesty Boost—It's a Twist Nobody Expected",
            },
            {
              title: "🍑 Papaya Pops After Pulp-Rich Trade Rumors Squashed",
            },
          ]}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${index}`}
                  />
                }
                title={<a href="#">{item.title}</a>}
                description={`${formatMinutesToHoursMinutes(
                  42 * (index + 1)
                )} - Fruteria News`}
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};
const LiveCard: React.FC = () => {
  const [fruitType, setFruitType] = useState<FruitName>("Banana");
  const [loading, setLoading] = useState(true);
  const { theme: appTheme } = useContext(AppContext);
  const { token } = theme.useToken();
  const [options, setOptions] = useState<AgCartesianChartOptions>({
    background: {
      visible: false,
    },
    theme: {
      baseTheme: appTheme === "dark" ? "ag-default-dark" : "ag-default",
      params: {
        fontSize: 9,
      },
    },
    axes: [
      {
        type: "number",
        position: "right",
        keys: ["value"],
        crosshair: { enabled: false },
        label: { enabled: false },
      },
      {
        type: "number",
        position: "bottom",
        keys: ["index"],
        crosshair: { enabled: false },
        gridLine: { enabled: false },
        label: { enabled: false },
      },
    ],
    series: [
      {
        type: "area",
        xKey: "index",
        yKey: "value",
        interpolation: { type: "smooth" },
        stroke: token.colorSuccessActive,
        strokeWidth: 2,
        marker: {
          itemStyler: ({ datum, xKey }) => {
            return {
              fill:
                datum[xKey] === 9 ? token.colorSuccessActive : "transparent",
            };
          },
        },
        label: {
          formatter: ({ datum, xKey, yKey }) => {
            if (datum[xKey] === 9) return datum[yKey].toFixed(2);
            return "";
          },
        },
        fill: {
          type: "gradient",
          colorStops: [
            { color: token.colorBgContainer, stop: 0.1 },
            { color: token.colorSuccessBorder }, //will continue to the end
          ],
        },
      },
    ],
  });
  const [value, setValue] = useState<FruitData["value"]>();
  useEffect(() => {
    const sub = hot$.subscribe((d) => {
      if (!d) return;
      const [result] = d.filter((o) => o.name === fruitType) ?? [];
      if (!result) return;
      if (result.value) {
        setValue(result.value);
      }
      setLoading(false);
      setOptions((prev) => {
        const next = produce(prev, (draft) => {
          const min = Math.min(...(result.timeline ?? []));
          const max = Math.max(...(result.timeline ?? []));
          draft.data = result.timeline?.map((v, i) => ({ value: v, index: i }));
          draft.axes!.at(0)!.interval = { values: [min, max] };
        });
        return next;
      });
    });
    return () => sub.unsubscribe();
  }, [fruitType]);

  useEffect(() => {
    setOptions((prev) => {
      const next = produce(prev, (draft) => {
        if (draft.theme && typeof draft.theme !== "string") {
          draft.theme.baseTheme =
            appTheme === "dark" ? "ag-default-dark" : "ag-default";
        }
        (draft.series!.at(0)! as AgAreaSeriesOptions).fill = {
          type: "gradient",
          colorStops: [
            { color: token.colorBgContainer, stop: 0.1 },
            { color: token.colorSuccessBorder },
          ],
        };
      });
      return next;
    });
  }, [appTheme, token]);

  const isPositive = value ? value.delta > 0 : null;
  const items = fruitName.map((fruit) => {
    return {
      key: fruit,
      label: (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            setFruitType(fruit);
          }}
        >
          {fruit}
        </a>
      ),
    };
  }) as MenuProps["items"];
  return (
    <Spin spinning={loading}>
      <Card size="small">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <span
            style={{
              color:
                appTheme === "dark" ? token.colorWarning : token.colorPrimary,
            }}
          >
            <Space>
              <strong>{fruitType.toUpperCase()}</strong>
              <DownOutlined />
            </Space>
          </span>
        </Dropdown>
        <Flex>
          <Statistic
            style={{ flex: 1 }}
            title="Trend"
            value={value?.deltaPercent}
            precision={2}
            valueStyle={{
              color: value?.deltaPositive
                ? token.colorSuccess
                : token.colorError,
            }}
            prefix={
              isPositive === null ? null : isPositive ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="%"
          />
          <Statistic
            style={{ flex: 1 }}
            title="Buy / Sell"
            value={value?.current}
            precision={2}
            prefix={"$"}
            suffix={<small>/{value?.sell.toFixed(2)}</small>}
          />
        </Flex>
        <AgCharts options={options} style={{ height: 100, width: "100%" }} />
        <Typography.Text type="secondary">
          <small>Last 10 transactions</small>
        </Typography.Text>
      </Card>
    </Spin>
  );
};

export default SiderContent;
