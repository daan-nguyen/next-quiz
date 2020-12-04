import ConfettiGenerator from "confetti-js";
import fetch from "isomorphic-unfetch";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Container from "../components/Container";
import { ANSWER_COLORS, USER_COLORS } from "../utils/colors";
import { BASE_URL } from "../utils/env";
import useSocket from "../utils/useSocket";
import { usersToArray } from "../utils/utils";
import { BasePlate, UserPlate, ScorePlate } from '../components/Plates';

const ResultContainer = styled(Container)`
  flex-direction: column;
`;

const UserLine = styled.div`
  display: flex;
  flex-direction: row;
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
      const confettiSettings = { target: "confetti", max: 500 };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    });

    return () => {
      socket?.close();
    };
  }, [socket]);

  return (
    <ResultContainer>
      {usersToArray(users)
        // .filter((user) => !user.eliminated)
        .map((item) => (
          <UserLine key={item.name}>
            <ScorePlate
              style={{
                width: (80 / 20) * item.score + "%",
                backgroundColor: USER_COLORS[item.colorNo],
              }}
            >
              {item.score}
            </ScorePlate>
            <UserPlate style={{ backgroundColor: USER_COLORS[item.colorNo] }}>
              {item.name}
            </UserPlate>
            <BasePlate
              style={{
                backgroundColor: item.answer
                  ? ANSWER_COLORS[item.answer]
                  : "transparent",
                color: item.answer ? "#fff" : "#000",
              }}
            >
              {item.answer?.toUpperCase()}
            </BasePlate>
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
