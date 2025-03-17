import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "./services/https";

const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ from: string; role: string; content: string }[]>([]);
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
      const parts = event.data.split("-");
      const content = parts[0];
      const from = parts[1];
      const role = parts[2];
      setMessages((prev) => [...prev, { from, role, content }]);
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
