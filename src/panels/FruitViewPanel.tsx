import React, { useState } from "react";
// import { MockFruitMachine, Fruit } from '../../engine/MockFruitMachine';
export type Fruit = "apple" | "banana" | "orange";

export interface FruitInventory {
  [fruit: string]: number;
}

export class MockFruitMachine {
  private inventory: FruitInventory = {
    apple: 10,
    banana: 8,
    orange: 15,
  };

  getInventory(): FruitInventory {
    return { ...this.inventory };
  }

  buy(fruit: Fruit, amount: number): boolean {
    if (this.inventory[fruit] >= amount) {
      this.inventory[fruit] -= amount;
      return true;
    }
    return false;
  }

  sell(fruit: Fruit, amount: number): void {
    this.inventory[fruit] += amount;
  }
}

// Add Ant Design imports
import {
  Form,
  Select,
  InputNumber,
  Button,
  Typography,
  List,
  message as antdMessage,
} from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const fruitList: Fruit[] = ["apple", "banana", "orange"];
const machine = new MockFruitMachine();

export const FruitViewPanel: React.FC = () => {
  const [inventory, setInventory] = useState(machine.getInventory());
  const [selectedFruit, setSelectedFruit] = useState<Fruit>("apple");
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState("");

  const handleBuy = () => {
    if (machine.buy(selectedFruit, amount)) {
      setMessage(`Bought ${amount} ${selectedFruit}(s).`);
      antdMessage.success(`Bought ${amount} ${selectedFruit}(s).`);
    } else {
      setMessage(`Not enough ${selectedFruit}s in inventory.`);
      antdMessage.error(`Not enough ${selectedFruit}s in inventory.`);
    }
    setInventory(machine.getInventory());
  };

  const handleSell = () => {
    machine.sell(selectedFruit, amount);
    setMessage(`Sold ${amount} ${selectedFruit}(s).`);
    antdMessage.info(`Sold ${amount} ${selectedFruit}(s).`);
    setInventory(machine.getInventory());
  };

  return (
    <div style={{ padding: 20 }}>
      <Form
        layout="inline"
        style={{ marginBottom: 16, flexWrap: "wrap", gap: 12 }}
        onSubmitCapture={(e) => e.preventDefault()}
      >
        <Form.Item label="Fruit">
          <Select
            value={selectedFruit}
            onChange={(value) => setSelectedFruit(value)}
            style={{ width: 120 }}
          >
            {fruitList.map((fruit) => (
              <Option key={fruit} value={fruit}>
                {fruit}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Amount">
          <InputNumber
            min={1}
            value={amount}
            onChange={(value) => setAmount(Number(value))}
            style={{ width: 80 }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleBuy}>
            Buy
          </Button>
          <Button type="default" onClick={handleSell}>
            Sell
          </Button>
        </Form.Item>
      </Form>
      <div style={{ minHeight: 24, marginBottom: 16 }}>
        {message && (
          <Text
            strong
            style={{
              color: message.startsWith("Bought")
                ? "#52c41a"
                : message.startsWith("Not enough")
                ? "#f5222d"
                : undefined,
            }}
          >
            {message}
          </Text>
        )}
      </div>
      <Title level={4} style={{ marginBottom: 8 }}>
        Inventory
      </Title>
      <List
        size="small"
        dataSource={fruitList}
        renderItem={(fruit) => (
          <List.Item style={{ padding: "4px 0" }}>
            <Text style={{ color: "#bfcfff", fontSize: 16 }}>
              {fruit}: <Text strong>{inventory[fruit]}</Text>
            </Text>
          </List.Item>
        )}
      />
    </div>
  );
};
