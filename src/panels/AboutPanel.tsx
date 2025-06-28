import React from "react";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;
/**
 * AboutPanel displays information about the application.
 */
const AboutPanel: React.FC = () => (
  <Typography>
    <div style={{ padding: 24, color: "#e0e0e0", fontFamily: "monospace" }}>
      <Title level={2} style={{ fontWeight: 700, fontSize: 22, margin: 0 }}>
        About
      </Title>
      <div style={{ marginTop: 12 }}>
        <Paragraph>
          Welcome to <b>fruteria</b>!<br />
          This is a playful trading app for fruit, built with React.
          <br />
          Drag panels from the sidebar to explore features.
          <br />
          <br />
          <i>Made with 🍌 and ❤️</i>
        </Paragraph>
      </div>
    </div>
  </Typography>
);

export default AboutPanel;
