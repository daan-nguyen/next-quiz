import { Card, Button } from "antd";
import useSocket from "../utils/useSocket";
import useKeyPress from "../utils/useKeyPress";

const Buzzer: React.FC<{ socket: any }> = ({ socket }) => {
  const spacePress = useKeyPress(" ");

  const buzzHandler = () => {
    socket?.emit("buzz");
  };

  return (
    <Card style={{ width: 400, textAlign: "center" }} title="Get ready...">
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
    </Card>
  );
};

export default Buzzer;
