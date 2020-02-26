import { NextPage } from "next";
import { Card, Button } from "antd";
import Container from "../components/Container";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";

const Admin: NextPage<{ users: Users }> = props => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [users, setUsers] = useState<{}>({});

  useEffect(() => {
    socketRef.current = io(`${BASE_URL}`);
    socketRef.current.on("users", (users: Object) => setUsers(users));

    setUsers(props.users);

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleClear = () => {
    socketRef.current?.emit("clear");
  };

  return (
    <Container>
      <Card style={{ width: 400, textAlign: "center" }} title="Admin">
        <p style={{ textAlign: "left" }}>
          <strong>Currently playing: </strong>
          {Object.keys(users).length}
        </p>
        <Button type="danger" block onClick={handleClear}>
          Reset
        </Button>
      </Card>
    </Container>
  );
};

Admin.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { users } = await res.json();

  return { users };
};

export default Admin;
