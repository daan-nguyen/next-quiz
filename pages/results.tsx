import { NextPage } from "next";
import Container from "../components/Container";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import { Timeline } from "antd";

const Results: NextPage<{ users: Users; results: Array<Result> }> = props => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [users, setUsers] = useState<Users>({});
  const [results, setResults] = useState<Array<Result>>([]);

  useEffect(() => {
    setUsers(props.users);
    setResults(props.results);

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
      <Timeline pending="Waiting..." style={{ width: 400, textAlign: "left" }}>
        {results.map((result, i) => {
          let time = 0;

          if (i > 0) {
            time = result.time - results[0].time;
          }

          return (
            <Timeline.Item>
              <strong>{users[result.id]}</strong> <em>+{time}ms</em>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Container>
  );
};

Results.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const state = await res.json();

  return state;
};

export default Results;
