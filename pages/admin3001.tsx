import { NextPage } from "next";
import fetch from "isomorphic-unfetch";
import { Card, Button, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import useSocket from "../utils/useSocket";
import LeftRight from "../components/LefRight";
import { OptionType } from "antd/lib/select";
import styled from "styled-components";
import { usersToArray } from "../utils/utils";

const COLORS = ["#a0d911", "#fadb14", "#faad14"];

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Admin: NextPage<{
  users: Users;
  settings: Settings;
  adminPassword: boolean;
}> = (props) => {
  const socket = useSocket();
  const [users, setUsers] = useState<Users>({});
  const [results, setResults] = useState<Array<Result>>([]);
  const [settings, setSettings] = useState<Settings>({
    firstBuzzOnly: true,
    numAnswers: 2,
  });

  useEffect(() => {
    setUsers(props.users);
    setSettings(props.settings);
  }, []);

  useEffect(() => {
    socket?.on("server:update:users", (users: Users) => setUsers(users));
    socket?.on("server:update:settings", (settings: Settings) =>
      setSettings(settings)
    );
  }, [socket]);

  const handleAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    const answer = event.currentTarget.value;
    socket?.emit("admin:answer", answer);
  };

  const handleResetAll = () => {
    socket?.emit("admin:resetall");
  };

  const handleFirstBuzzSetting = (checked: boolean) => {
    const newSettings: Settings = {
      ...settings,
      firstBuzzOnly: checked,
    };

    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleNumAnswersChange = (number: number) => {
    const newSettings: Settings = {
      ...settings,
      numAnswers: number,
    };

    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const updateSettings = (settings: Settings) => {
    socket?.emit("admin:settings", settings);
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
            <strong>Number of answers</strong>
          </p>
          <Select
            defaultValue={settings.numAnswers}
            onChange={handleNumAnswersChange}
          >
            <Select.Option value={2}>2</Select.Option>
            <Select.Option value={3}>3</Select.Option>
          </Select>
        </LeftRight>
        <LeftRight>
          <p>
            <strong>Correct answer</strong>
          </p>
        </LeftRight>
        <ButtonContainer>
          <Button type="primary" onClick={handleAnswer} value="a">
            Answer A
          </Button>
          <Button type="primary" onClick={handleAnswer} value="b">
            Answer B
          </Button>
          <Button type="primary" onClick={handleAnswer} value="c">
            Answer C
          </Button>
        </ButtonContainer>
        <br />
        <br />
        <br />
        <Button block type="danger" onClick={handleResetAll}>
          Reset all
        </Button>
      </Card>
      <VerticalContainer>
        <Card
          style={{ width: 400, textAlign: "center", margin: 5 }}
          title="In Play"
        >
          {usersToArray(users)
            .filter((user) => !user.eliminated)
            .map((item) => (
              <LeftRight>
                <p>{item.name}</p>
                <p>{item.answer?.toUpperCase()}</p>
              </LeftRight>
            ))}
        </Card>
        <Card
          style={{ width: 400, textAlign: "center", margin: 5 }}
          title="Out"
        >
          {usersToArray(users)
            .filter((user) => user.eliminated)
            .map((item) => (
              <LeftRight>
                <p>{item.name}</p>
                <p>{item.answer?.toUpperCase()}</p>
              </LeftRight>
            ))}
        </Card>
      </VerticalContainer>
    </Container>
  );
};

Admin.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { users, settings, adminPassword, results } = await res.json();

  return { users, settings, adminPassword, results };
};

export default Admin;
