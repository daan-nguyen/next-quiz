import { NextPage } from "next";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import { Timeline, Card, Button } from "antd";
import useSocket from "../utils/useSocket";
import LeftRight from "../components/LefRight";
import { usersToArray } from "../utils/utils";
import { COLORS } from "../utils/colors";
import styled from "styled-components";

const StyledLeftRight = styled(LeftRight)`
  border-radius: 2px;
  line-height: 20px;
  padding: 5px 15px;
  margin: 0 -15px;
  margin-bottom: 3px;
`;

const Results: NextPage<{ users: Users }> = (props) => {
  const socket = useSocket();
  const [users, setUsers] = useState<Users>({});
  const [results, setResults] = useState<Array<Result>>([]);
  // const userCount = Object.keys(users).length;

  useEffect(() => {
    setUsers(props.users);
  }, []);

  useEffect(() => {
    socket?.on("server:update:users", (users: Users) => setUsers(users));

    return () => {
      socket?.close();
    };
  }, [socket]);

  return (
    <Container>
      <Card style={{ width: 400, textAlign: "center", margin: 5 }} title="In">
        {usersToArray(users)
          .filter((user) => !user.eliminated)
          .map((item) => (
            <StyledLeftRight
              style={{
                backgroundColor: item.answer
                  ? COLORS[item.answer]
                  : "transparent",
                color: item.answer ? "#fff" : "#000",
              }}
            >
              <div>{item.name}</div>
              <div>{item.answer?.toUpperCase()}</div>
            </StyledLeftRight>
          ))}
      </Card>
      <Card style={{ width: 400, textAlign: "center", margin: 5 }} title="Out">
        {usersToArray(users)
          .filter((user) => user.eliminated)
          .map((item) => (
            <StyledLeftRight>
              <p>{item.name}</p>
            </StyledLeftRight>
          ))}
      </Card>
    </Container>
  );
};

Results.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { users } = await res.json();

  return { users };
};

export default Results;
