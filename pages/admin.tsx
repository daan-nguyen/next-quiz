import { NextPage } from "next";
import { Card, Button } from "antd";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import useSocket from "../utils/useSocket";

const Admin: NextPage<{ users: Users }> = props => {
  const socket = useSocket();
  const [users, setUsers] = useState<{}>({});

  useEffect(() => {
    setUsers(props.users);
  }, []);

  useEffect(() => {
    socket?.on("users", (users: Object) => setUsers(users));
  }, [socket]);

  const handleClear = () => {
    socket?.emit("clear");
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
