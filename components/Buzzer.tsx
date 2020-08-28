import { Card, Button } from "antd";
import styled from "styled-components";
import { COLORS } from "../utils/colors";

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
  margin: 0 5px;
`;

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Buzzer: React.FC<{ socket: any; numAnswers: number | undefined }> = ({
  socket,
  numAnswers,
}) => {
  const buzzHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const answer: string = event.currentTarget.value;
    socket?.emit("client:answer", answer);
  };

  return (
    <StyledCard title="Get ready...">
      <StyledContainer>
        <StyledButton
          type="primary"
          onClick={buzzHandler}
          value="a"
          style={{
            backgroundColor: COLORS.a,
            borderColor: COLORS.a,
          }}
        >
          A
        </StyledButton>
        <StyledButton
          type="primary"
          onClick={buzzHandler}
          value="b"
          style={{
            backgroundColor: COLORS.b,
            borderColor: COLORS.b,
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
              backgroundColor: COLORS.c,
              borderColor: COLORS.c,
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
