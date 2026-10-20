import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("ORDER-101");
  const [status, setStatus] = useState("PLACED");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      socket.emit("join-order", orderId);
    };

    const handleDisconnect = () => setConnected(false);

    const handleStatusUpdate = (update) => {
      if (update.orderId === orderId) {
        setStatus(update.status);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("order-status-updated", handleStatusUpdate);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("order-status-updated", handleStatusUpdate);
      socket.disconnect();
    };
  }, [orderId]);

  function joinOrder() {
    if (!orderId.trim()) return;
    if (socket.connected) {
      socket.emit("join-order", orderId.trim());
    } else {
      setStatus("Waiting for connection...");
    }
  }

  function testStatusUpdate() {
  socket.emit("update-order-status", {
    orderId,
    status: "READY",
  });
}

  return (
    <main style={{ padding: 24 }}>
      <h1>Live Order Tracking</h1>
      <p>Connection: {connected ? "Connected" : "Disconnected"}</p>

      <label>
        Order ID:{" "}
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
        />
      </label>

      <button type="button" onClick={joinOrder}>
        Track Order
      </button>

      

      <h2>Current status: {status}</h2>
    </main>
  );
}
