import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "./services/https";

export const WS_URL = "wss://tsubaki.onrender.com//ws";

type Message = {
  ID: number;
  from: string;
  role: string;
  content: string;
};

const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  let pingInterval: ReturnType<typeof setInterval> | null = null;
  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onopen = async () => {
      const token = await getAuthToken();
      if (token) {
        const decoded = jwtDecode(token);
        const username = (decoded as any).username;
        const role = (decoded as any).role;
        socket.send(JSON.stringify({ type: "join", username: username, role: role }));
        console.log("✅ Connected to WebSocket");

        pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
          }
        }, 20000);
      } else {
        console.error("No token found");
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // ✅ parse JSON object

        setMessages(prev => [...prev, data]);
      } catch (err) {
        console.error("❌ WebSocket parse error:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔴 Disconnected from WebSocket");
    };

    setWs(socket);

    return () => {
      if (pingInterval) clearInterval(pingInterval);
      socket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
