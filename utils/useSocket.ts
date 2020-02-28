import { useEffect, useState } from "react";
import { BASE_URL } from "./env";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    setSocket(io(`${BASE_URL}`));

    return () => {
      socket?.close();
    };
  }, []);

  return socket;
};

export default useSocket;
