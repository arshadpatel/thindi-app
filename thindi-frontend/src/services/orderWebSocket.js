
import { Client } from "@stomp/stompjs";

export function connectOrderUpdates(orderId, onUpdate) {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    reconnectDelay: 5000,

    onConnect: () => {
      client.subscribe(`/topic/orders/${orderId}`, (message) => {
        if (message.body) {
          onUpdate(JSON.parse(message.body));
        }
      });
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers.message);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket connection error:", error);
    },
  });

  client.activate();

  return () => {
    client.deactivate();
  };
}
