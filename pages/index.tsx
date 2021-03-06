import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Card, Button, Input } from "antd";
import Container from "../components/Container";
import useSocket from "../utils/useSocket";
import Buzzer from "../components/Buzzer";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import ConfettiGenerator from "confetti-js";

const Home: NextPage<{ settings: Settings }> = (props) => {
  const socket = useSocket();
  // const [username, setUsername] = useState<string>();
  const [user, setUser] = useState<UserData>();
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    setSettings(props.settings);
  }, []);

  useEffect(() => {
    socket?.on("server:update:settings", (settings: Settings) =>
      setSettings(settings)
    );
    socket?.on("server:update:users", (users: Users) => setUser(users[socket.id]));
    socket?.on("server:confetti", (id: string) => {
      if (id === socket.id) {
        const confettiSettings = { target: "confetti", max: 500 };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
      }
    });

    return () => {
      socket?.close();
    };
  }, [socket]);

  const joinHandler = (name: string) => {
    const cleanName = name.trim();

    if (cleanName && socket) {
      socket.emit("join-room", cleanName);
    }
  };

  return (
    <Container>
      {!user ? (
        <Card style={{ width: 400 }} title="What's your name?">
          <Input.Search
            placeholder="Name"
            enterButton="Join"
            onSearch={joinHandler}
            maxLength={20}
          />
        </Card>
      ) : (
        <Buzzer socket={socket} numAnswers={settings?.numAnswers} user={user}/>
      )}
    </Container>
  );
};

Home.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { settings } = await res.json();

  return { settings };
};

export default Home;
