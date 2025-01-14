import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef();
  const terminalInstance = useRef(null);
  const [socket, setSocket] = useState();
  const { User } = useSocket();

  useEffect(() => {
    setSocket(User.Socket);
    if (!socket || !terminalRef.current) return;

    // Initialize terminal
    const term = new XTerminal({
      rows: 20,
      cursorBlink: true,
      // Add any other terminal configurations you need
    });

    // Store terminal instance for cleanup
    terminalInstance.current = term;

    try {
      // Open terminal
      term.open(terminalRef.current);
      
      // Initial terminal setup
      socket.emit("terminal:write", "\n");

      // Handle user input
      const onData = (data) => {
        if (socket?.connected) {
          socket.emit("terminal:write", data);
        }
      };
      term.onData(onData);

      // Handle incoming terminal data
      const onTerminalData = (data) => {
        if (term && !term.element.isConnected) return;
        term.write(data);
      };

      socket.on("terminal:data", onTerminalData);

      // Cleanup function
      return () => {
        socket.off("terminal:data", onTerminalData);
        term.dispose();
        terminalInstance.current = null;
      };
    } catch (error) {
      console.error("Error initializing terminal:", error);
      if (terminalInstance.current) {
        terminalInstance.current.dispose();
        terminalInstance.current = null;
      }
    }
  }, [socket]);

  return <div ref={terminalRef} id="terminal" className="terminal-container" />;
};

export default Terminal;