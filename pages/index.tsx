import { NextPage } from "next";
import fetch from "isomorphic-unfetch";
import io from "socket.io-client";
import { BASE_URL } from "../utils/env";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Card, Button, Input } from "antd";
import Container from "../components/Container";

const Home: NextPage<{ messages: [] }> = ({ messages }) => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    socketRef.current = io(`${BASE_URL}`);

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const joinHandler = (name: string) => {
    const cleanName = name.trim();

    if (cleanName) {
      socketRef.current?.emit("join-room", cleanName);
      setUsername(cleanName);
    }
  };

  const buzzHandler = () => {
    socketRef.current?.emit("buzz");
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
        <Card style={{ width: 400, textAlign: "center" }} title="Get ready...">
          <Button
            style={{ height: 300, width: 300, fontSize: "60px" }}
            type="danger"
            onClick={buzzHandler}
          >
            BUZZ
          </Button>
        </Card>
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
