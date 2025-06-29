import React from "react";
import { Form, Input, Button, Typography, Alert, Card } from "antd";
import type { FormProps } from "antd";

import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type FieldType = {
  username?: string;
  password?: string;
};

interface LoginComponentProps {
  onLoginSuccess: () => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = (props) => {
  const [errMsg, setErrMsg] = React.useState<string>("");

  const handleSubmit = React.useCallback<
    NonNullable<FormProps<FieldType>["onFinish"]>
  >(
    (values) => {
      const { username, password } = values;

      setErrMsg("");
      fetch("http://localhost:3000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then(async (res) => {
          return res.json();
        })
        .then(() => {
          props.onLoginSuccess();
        })
        .catch((err) => {
          // "Failed to fetch" is a common message for network errors in most browsers,
          if (err.message === "Failed to fetch") {
            setErrMsg("Mock server is not running. Please start the server.");
          } else {
            setErrMsg(err.message || "Login failed");
          }
        });
    },
    [props]
  );

  const inputStyle = React.useMemo(
    () => ({
      border: "1px solid #3e4a6b",
    }),
    []
  );

  return (
    <Wrapper>
      <Card
        style={{
          minWidth: 340,
          boxShadow: "0 2px 16px #0003",
          background: "#232b3e",
          border: "1px solid #3e4a6b",
        }}
        styles={{
          body: {
            padding: 32,
          },
        }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "#fff",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: "0 1px 2px #0006",
          }}
        >
          Login
        </Typography.Title>
        <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item<FieldType>
            name="username"
            label={
              <span style={{ color: "#e0e0e0", fontWeight: 500 }}>
                Username
              </span>
            }
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              autoFocus
              style={inputStyle}
              placeholder="Enter your username"
            />
          </Form.Item>
          <Form.Item<FieldType>
            name="password"
            label={
              <span style={{ color: "#e0e0e0", fontWeight: 500 }}>
                Password
              </span>
            }
          >
            <Input.Password
              style={inputStyle}
              placeholder="Enter your password"
            />
          </Form.Item>
          {errMsg && (
            <Form.Item>
              <Alert message={errMsg} type="error" showIcon />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                fontWeight: 600,
                letterSpacing: 1,
                background: "linear-gradient(90deg, #2b3556 0%, #3e4a6b 100%)",
                border: "none",
                color: "#fff",
                boxShadow: "0 2px 8px #0002",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Wrapper>
  );
};
