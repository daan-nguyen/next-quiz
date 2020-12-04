import { NextPage } from "next";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/env";
import fetch from "isomorphic-unfetch";
import useSocket from "../utils/useSocket";
import { usersToArray } from "../utils/utils";
import { ANSWER_COLORS, USER_COLORS } from "../utils/colors";
import styled from "styled-components";
import ConfettiGenerator from "confetti-js";

const ResultContainer = styled(Container)`
  flex-direction: column;
`;

const UserLine = styled.div`
  display: flex;
  flex-direction: row;
`;

const UserPlate = styled.div`
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: #fff;
  border-radius: 2px;
  line-height: 20px;
  padding: 5px 15px;
  margin-bottom: 3px;
  margin-right: 3px;
  background: red;
`;

const ScorePlate = styled.div`
  width: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  transition: width 1s;

  color: #fff;
  border-radius: 2px;
  line-height: 20px;
  padding: 5px 15px;
  margin-bottom: 3px;
  margin-right: 3px;
  background: red;
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
    socket?.on("server:confetti", () => {
      const confettiSettings = { target: 'my-canvas', max: 500 };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    })

    return () => {
      socket?.close();
    };
  }, [socket]);

  // useEffect(() => {
  //   const confettiSettings = { target: 'my-canvas', max: 500 };
  //   const confetti = new ConfettiGenerator(confettiSettings);
  //   confetti.render();
  
  //   return () => confetti.clear();
  // }, [])

  return (
    <ResultContainer>
      {usersToArray(users)
        // .filter((user) => !user.eliminated)
        .map((item) => (
          <UserLine key={item.name}>
            <UserPlate style={{ backgroundColor: USER_COLORS[item.colorNo] }}>
              {item.name}
            </UserPlate>
            <ScorePlate
              style={{
                width: (80 / 20) * item.score + "%",
                minWidth: "40px",
                textAlign: "right",
                backgroundColor: USER_COLORS[item.colorNo],
              }}
            >
              {item.score}
            </ScorePlate>
            <ScorePlate
              style={{
                backgroundColor: item.answer
                  ? ANSWER_COLORS[item.answer]
                  : "transparent",
                color: item.answer ? "#fff" : "#000",
              }}
            >
              {item.answer?.toUpperCase()}
            </ScorePlate>
          </UserLine>
        ))}
    </ResultContainer>
  );
};

Results.getInitialProps = async ({ req }) => {
  const res = await fetch(`${BASE_URL}/state`);
  const { users } = await res.json();

  return { users };
};

export default Results;
