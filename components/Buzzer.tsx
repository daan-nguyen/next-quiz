import { Card, Button } from "antd";
import useSocket from "../utils/useSocket";
import useKeyPress from "../utils/useKeyPress";
import styled, { keyframes, css } from "styled-components";

const StyledCard = styled(Card)<{ buzzed: boolean }>`
  width: 400px;
  text-align: center;
  transition-property: background-color;
  transition-timing-function: ease-in;
  transition-duration: 0.1s;

  background-color: ${(props) => (props.buzzed ? "#ff7875" : "#ffffff")};
`;

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Buzzer: React.FC<{ socket: any }> = ({ socket }) => {
  const spacePress = useKeyPress(" ");

  const buzzHandler = () => {
    socket?.emit("buzz");
  };

  return (
    <StyledCard title="Get ready..." buzzed={spacePress}>
      <StyledContainer>
        <Button
          style={{ height: 300, width: 300, fontSize: "60px" }}
          type="danger"
          onClick={buzzHandler}
        >
          BUZZ
        </Button>
        <p>
          ... or use your <strong>space bar</strong>!
        </p>
        {spacePress && buzzHandler()}
      </StyledContainer>
    </StyledCard>
  );
};

export default Buzzer;
