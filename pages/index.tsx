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
  const [users, setUsers] = useState<Object>({});
  const [buzzed, setBuzzed] = useState<boolean>(true);

  useEffect(() => {
    socketRef.current = io(`${BASE_URL}`);
    socketRef.current.on("users", (users: Object) => setUsers(users));
    socketRef.current.on("clear", () => setBuzzed(false));

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const joinHandler = (value: string) => {
    if (value) {
      socketRef.current?.emit("join-room", value);
      setUsername(value);
    }
  };

  const buzzHandler = () => {
    socketRef.current?.emit("buzz");
    setBuzzed(true);
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
        <Card
          style={{ width: 400, textAlign: "center" }}
          title={!buzzed ? "Get ready..." : "Waiting for next question"}
        >
          <Button
            style={{ height: 300, width: 300 }}
            type="danger"
            onClick={buzzHandler}
            disabled={buzzed}
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
