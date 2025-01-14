import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import apiClient from '../services/api-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const [SocketUrl, setSocketUrl] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    // useEffect(() => {
    //     let activeSocket = null;

    //     const initializeSocket = async () => {
    //         try {
    //             setIsConnecting(true);
    //             setError(null);

    //             // Get socket URL from API
    //             const response = await apiClient.get("container/socketurl");
    //             const socketUrl = response.data.url;
    //             setSocketUrl(socketUrl);

    //             if (!socketUrl) {
    //                 throw new Error('Socket URL not received from server');
    //             }

    //             // Initialize socket connection
    //             const newSocket = io(socketUrl, {
    //                 reconnection: true,
    //                 reconnectionAttempts: 5,
    //                 reconnectionDelay: 1000,
    //             });

    //             // Handle connection events
    //             newSocket.on('connect', () => {
    //                 console.log('Socket connected successfully');
    //                 setError(null);
    //             });

    //             newSocket.on('connect_error', (err) => {
    //                 console.error('Socket connection error:', err);
    //                 setError('Failed to connect to server');
    //             });                 

    //             newSocket.on('disconnect', (reason) => {
    //                 console.log('Socket disconnected:', reason);
    //                 if (reason === 'io server disconnect') {
    //                     // Server initiated disconnect, try to reconnect
    //                     newSocket.connect();
    //                 }
    //             });

    //             activeSocket = newSocket;
    //             setSocket(newSocket);
    //         } catch (err) {
    //             console.error('Socket initialization error:', err);
    //             setError(err.message || 'Failed to initialize socket connection');
    //         } finally {
    //             setIsConnecting(false);
    //         }
    //     };

    //     initializeSocket();

    //     // Cleanup function
    //     return () => {
    //         if (activeSocket) {
    //             activeSocket.disconnect();
    //             setSocket(null);
    //         }
    //     };
    // }, []); // Empty dependency array since we only want to initialize once

    // const contextValue = {
    //     socket,
    //     SocketUrl,
    //     error,
    //     isConnecting,
    //     isConnected: socket?.connected || false,
    // };

    const [User, setUser] = useState({
        Username: "",
        Email: "",
        Role: "",
        Password: "",
        Socket: null,
        SocketUrl: "",
      });

    return (
        <SocketContext.Provider value={{User, setUser}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
// import React, { useCallback, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const SocketContext = React.createContext(null);


// export const SocketProvider = ({ children }) => {
//     const [socket, setSocket] = useState();
    
  
    
  
    
  
//     useEffect(() => {
//       const _socket = io("http://localhost:9000");
  
//       setSocket(_socket);
  
//       return () => {
//         _socket.disconnect();
//         setSocket(undefined);
//       };
//     }, []);
  
//     return (
//       <SocketContext.Provider value={{ socket }}>
//         {children}
//       </SocketContext.Provider>
//     );
//   };