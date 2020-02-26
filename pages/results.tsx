import { NextPage } from "next";
import Container from "../components/Container";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import { Timeline } from "antd";

const COLORS = ["#a0d911", "#fadb14", "#faad14"];

const Results: NextPage<{ users: Users; results: Array<Result> }> = props => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [users, setUsers] = useState<Users>({});
  const [results, setResults] = useState<Array<Result>>([]);
  const userCount = Object.keys(users).length;

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
      <h2>
        {userCount} {userCount === 1 ? "player" : "players"}
      </h2>
      <Timeline pending="Waiting..." style={{ width: 400, textAlign: "left" }}>
        {results.map((result, i) => {
          let time = 0;
          let color = "#ffccc7";

          if (i > 0) {
            time = result.time - results[0].time;
          }

          if (i < 3) {
            color = COLORS[i];
          }

          return (
            <Timeline.Item key={i} color={color}>
              <strong>{result.name}</strong> <em>+{time}ms</em>
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
