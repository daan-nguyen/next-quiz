import { NextPage } from "next";
import { Card, Button } from "antd";
import Container from "../components/Container";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";

const Admin: NextPage = props => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [users, setUsers] = useState<{}>({});

  useEffect(() => {
    socketRef.current = io(`${BASE_URL}`);
    socketRef.current.on("users", (users: Object) => setUsers(users));

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
        <Button type="danger" block onClick={handleClear}>
          Clear
        </Button>
      </Card>
    </Container>
  );
};

export default Admin;
