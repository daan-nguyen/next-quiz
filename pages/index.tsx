import { NextPage } from "next";
import { useState } from "react";
import { Card, Button, Input } from "antd";
import Container from "../components/Container";
import useSocket from "../utils/useSocket";
import Buzzer from "../components/Buzzer";

const Home: NextPage<{ messages: [] }> = ({ messages }) => {
  const socket = useSocket();
  const [username, setUsername] = useState<string>();

  const joinHandler = (name: string) => {
    const cleanName = name.trim();

    if (cleanName && socket) {
      socket.emit("join-room", cleanName);
      setUsername(cleanName);
    }
  };

  return (
    <Container>
      {!username ? (
        <Card style={{ width: 400 }} title="What's your name?">
          <Input.Search
            placeholder="Name"
            enterButton="Join"
            onSearch={joinHandler}
            maxLength={20}
          />
        </Card>
      ) : (
        <Buzzer socket={socket}/>
      )}
    </Container>
  );
};

// Home.getInitialProps = async ({ req }) => {
//   const res = await fetch(`${BASE_URL}/messages`);
//   const messages = await res.json();

//   return { messages };
// };

export default Home;
