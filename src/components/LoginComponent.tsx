import React from "react";
import { Form, Input, Button, Typography, Alert, Card, Flex } from "antd";
import type { FormProps } from "antd";
import { FullHeightWrapper } from "./UtilityComponent";
import type { UserDataType } from "../context/app";

type FieldType = {
  username?: string;
  password?: string;
};

interface LoginComponentProps {
  onLoginSuccess: (data: UserDataType) => void;
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
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const message = errorData.message || `Login failed (${res.status})`;
            throw new Error(message);
          }
          return res.json();
        })
        .then((res) => {
          const userData = res as UserDataType;
          props.onLoginSuccess(userData);
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
  return (
    <FullHeightWrapper>
      <Flex
        style={{
          height: "100%",
        }}
        justify="center"
        align="center"
      >
        <Card hoverable style={{ width: 400 }}>
          <Typography.Title
            level={2}
            style={{ textAlign: "center" }}
            className="mono"
          >
            Login
          </Typography.Title>
          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item<FieldType>
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input autoFocus placeholder="Enter your username" />
            </Form.Item>
            <Form.Item<FieldType> name="password" label="Password">
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            {errMsg && (
              <Form.Item>
                <Alert message={errMsg} type="error" showIcon />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </FullHeightWrapper>
  );
};
