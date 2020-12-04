import { Card, Button } from "antd";
import styled from "styled-components";
import { ANSWER_COLORS, USER_COLORS } from "../utils/colors";
import { UserPlate, ScorePlate } from "./Plates";

const StyledCard = styled(Card)`
  width: 400px;
  text-align: center;
  transition-property: background-color;
  transition-timing-function: ease-in;
  transition-duration: 0.1s;
`;

const StyledButton = styled(Button)`
  height: 100px;
  width: 100px;
  font-size: 40px;
  border-radius: 3px;
`;

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Buzzer: React.FC<{
  socket: any;
  numAnswers: number | undefined;
  user: UserData;
}> = ({ socket, numAnswers, user }) => {
  const buzzHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const answer: string = event.currentTarget.value;
    socket?.emit("client:answer", answer);
  };

  return (
    <StyledCard
      title={
        <StyledContainer>
          <UserPlate
            style={{
              width: "100%",
              backgroundColor: USER_COLORS[user.colorNo],
            }}
          >
            {user.name}
          </UserPlate>
          <ScorePlate
            style={{
              backgroundColor: USER_COLORS[user.colorNo],
              marginRight: 0,
            }}
          >
            {user.score}
          </ScorePlate>
        </StyledContainer>
      }
    >
      <StyledContainer>
        <UserPlate
          style={{
            width: "100%",
            marginRight: 0,
            marginBottom: "20px",
            backgroundColor: user.answer
              ? ANSWER_COLORS[user.answer]
              : "transparent",
            color: user.answer ? "#fff" : "#000",
          }}
        >
          {user.answer ? user.answer.toUpperCase() : "Your answer?"}
        </UserPlate>
      </StyledContainer>
      <StyledContainer>
        <StyledButton
          type="primary"
          onClick={buzzHandler}
          value="a"
          style={{
            backgroundColor: ANSWER_COLORS.a,
            borderColor: ANSWER_COLORS.a,
          }}
        >
          A
        </StyledButton>
        <StyledButton
          type="primary"
          onClick={buzzHandler}
          value="b"
          style={{
            backgroundColor: ANSWER_COLORS.b,
            borderColor: ANSWER_COLORS.b,
          }}
        >
          B
        </StyledButton>
        {numAnswers && numAnswers > 2 && (
          <StyledButton
            type="primary"
            onClick={buzzHandler}
            value="c"
            style={{
              backgroundColor: ANSWER_COLORS.c,
              borderColor: ANSWER_COLORS.c,
            }}
          >
            C
          </StyledButton>
        )}
      </StyledContainer>
    </StyledCard>
  );
};

export default Buzzer;
