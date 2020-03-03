import { NextPage } from "next";
import fetch from "isomorphic-unfetch";
import { Card, Button, Switch, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import useSocket from "../utils/useSocket";
import LeftRight from "../components/LefRight";

const Admin: NextPage<{ users: Users; settings: Settings }> = props => {
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

  return (
    <Container>
      <Card style={{ width: 400, textAlign: "center" }} title="Admin">
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
          Reset
        </Button>
      </Card>
    </Container>
  );
};

Admin.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { users, settings } = await res.json();

  return { users, settings };
};

export default Admin;
