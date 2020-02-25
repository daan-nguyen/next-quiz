import { NextPage } from "next";
import Container from "../components/Container";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import { Timeline } from "antd";

type Result = {
  id: string;
  time: number;
};

type Users = {
  [key: string]: string;
};

const Results: NextPage<{ initUsers: Users }> = ({ initUsers }) => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [users, setUsers] = useState<Users>({});
  const [results, setResults] = useState<Array<Result>>([]);

  useEffect(() => {
    setUsers(initUsers);

    socketRef.current = io(`${BASE_URL}`);
    socketRef.current.on("users", (users: Users) => setUsers(users));
    socketRef.current.on("update-results", (results: Array<Result>) => {
      setResults(results);
    });

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <Container>
      <h2>Players: {Object.keys(users).length}</h2>
      <Timeline pending="Waiting...">
        {results.map((result, i) => (
          <Timeline.Item>{users[result.id]}</Timeline.Item>
        ))}
      </Timeline>
    </Container>
  );
};

Results.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/users`);
  const initUsers = await res.json();

  return { initUsers };
};

export default Results;
