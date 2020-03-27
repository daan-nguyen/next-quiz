import { NextPage } from "next";
import fetch from "isomorphic-unfetch";
import { Card, Button, Switch, Tooltip, Input, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import useSocket from "../utils/useSocket";
import LeftRight from "../components/LefRight";
import { OptionType } from "antd/lib/select";

const Admin: NextPage<{
  users: Users;
  settings: Settings;
  adminPassword: boolean;
}> = props => {
  const socket = useSocket();
  const [users, setUsers] = useState<Users>({});
  const [settings, setSettings] = useState<Settings>({
    firstBuzzOnly: true
  });

  useEffect(() => {
    setUsers(props.users);
    setSettings(props.settings);
  }, []);

  useEffect(() => {
    socket?.on("users", (users: Users) => setUsers(users));
  }, [socket]);

  const handleClear = () => {
    socket?.emit("clear");
  };

  const handleFirstBuzzSetting = (checked: boolean) => {
    const newSettings: Settings = {
      ...settings,
      firstBuzzOnly: checked
    };

    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const updateSettings = (settings: Settings) => {
    socket?.emit("update:settings", settings);
  };

  const incrementScore = (event: React.MouseEvent<HTMLButtonElement>) => {
    socket?.emit("update:score:increment", event.currentTarget.value);
  };

  const decrementScore = (event: React.MouseEvent<HTMLButtonElement>) => {
    socket?.emit("update:score:decrement", event.currentTarget.value);
  };

  const handicapChangeHandler = (handicap: number, option: any) => {
    socket?.emit("update:handicap", {
      socketId: option.name,
      handicap
    });
  };

  return (
    <Container>
      <Card
        style={{ width: 400, textAlign: "center", margin: 5 }}
        title="Admin"
      >
        <p style={{ textAlign: "left" }}>
          <strong>Currently playing: </strong>
          {Object.keys(users).length}
        </p>
        <LeftRight>
          <p>
            <strong>First buzz only </strong>
            <Tooltip title="Only allows for user's first buzz to be registered">
              <InfoCircleOutlined />
            </Tooltip>
          </p>
          <Switch
            checked={settings.firstBuzzOnly}
            onChange={handleFirstBuzzSetting}
          />
        </LeftRight>
        <Button type="danger" block onClick={handleClear}>
          Clear Results
        </Button>
      </Card>
      <Card
        style={{ width: 400, textAlign: "center", margin: 5 }}
        title="Players"
      >
        {Object.keys(users).map(key => (
          <LeftRight key={key}>
            <p>{users[key].name}</p>
            <div>
              {users[key].score}{" "}
              <Button size="small" onClick={decrementScore} value={key}>
                -
              </Button>
              <Button size="small" onClick={incrementScore} value={key}>
                +
              </Button>
              <Select
                size="small"
                style={{ verticalAlign: "top", width: 70 }}
                defaultValue={users[key].handicap}
                onChange={handicapChangeHandler}
              >
                <Select.Option value={0} name={key}>
                  0
                </Select.Option>
                <Select.Option value={50} name={key}>
                  50
                </Select.Option>
                <Select.Option value={100} name={key}>
                  100
                </Select.Option>
                <Select.Option value={250} name={key}>
                  250
                </Select.Option>
                <Select.Option value={3000} name={key}>
                  3s
                </Select.Option>
              </Select>
            </div>
          </LeftRight>
        ))}
      </Card>
    </Container>
  );
};

Admin.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { users, settings, adminPassword } = await res.json();

  return { users, settings, adminPassword };
};

export default Admin;
