
import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function VendorOrderPanel() {
  const [orderId, setOrderId] = useState("ORDER-101");
  const [status, setStatus] = useState("PREPARING");
  const [connected, setConnected] = useState(socket.connected);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  function sendStatusUpdate() {
    if (!orderId.trim()) {
      setMessage("Please enter an order ID.");
      return;
    }

    if (!socket.connected) {
      setMessage("Not connected to the real-time server.");
      return;
    }

    socket.emit("update-order-status", {
      orderId: orderId.trim(),
      status,
    });

    setMessage(`Sent status "${status}" for ${orderId.trim()}.`);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Vendor Order Panel</h1>
      <p>Connection: {connected ? "Connected" : "Disconnected"}</p>

      <label>
        Order ID:{" "}
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
        />
      </label>

      <p>
        <label>
          New status:{" "}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="PLACED">Placed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </p>

      <button
        type="button"
        onClick={sendStatusUpdate}
        disabled={!connected}
      >
        Update Order Status
      </button>

      <p role="status">{message}</p>
    </main>
  );
}
