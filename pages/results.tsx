import { NextPage } from "next";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import { Timeline, Card, Button } from "antd";
import useSocket from "../utils/useSocket";
import LeftRight from "../components/LefRight";

const COLORS = ["#a0d911", "#fadb14", "#faad14"];

const Results: NextPage<{ users: Users; results: Array<Result> }> = props => {
  const socket = useSocket();
  const [users, setUsers] = useState<Users>({});
  const [results, setResults] = useState<Array<Result>>([]);
  const userCount = Object.keys(users).length;

  useEffect(() => {
    setUsers(props.users);
    setResults(props.results);
  }, []);

  useEffect(() => {
    socket?.on("users", (users: Users) => setUsers(users));
    socket?.on("update-results", (results: Array<Result>) => {
      setResults(results);
    });

    return () => {
      socket?.close();
    };
  }, [socket]);

  return (
    <Container>
      <Card
        style={{ width: 400, textAlign: "center", margin: 5 }}
        title="The finish line"
      >
        <Timeline
          pending="Waiting..."
          style={{ width: 400, textAlign: "left" }}
        >
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
      </Card>
      <Card
        style={{ width: 400, textAlign: "center", margin: 5 }}
        title="Scores"
      >
        {Object.keys(users).map(key => (
          <LeftRight>
            <p>{users[key].name}</p>
            <p>{users[key].score}</p>
          </LeftRight>
        ))}
      </Card>
    </Container>
  );
};

Results.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const state = await res.json();

  return state;
};

export default Results;
