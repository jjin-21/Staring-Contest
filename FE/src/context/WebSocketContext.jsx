import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import { useAccessTokenState } from "@/context/AccessTokenContext";
import SockJS from "sockjs-client";
import { baseUrl } from "@/api/url/baseUrl";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [client, setClient] = useState(undefined);
  const [match, setMatch] = useState(false);
  const [gameId, setGameId] = useState(undefined);
  const [opponentInfo, setOpponentInfo] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const accessToken = useAccessTokenState();
  const [isConnected, setIsConnected] = useState(false);

  const token = sessionStorage.getItem("accessToken");
  const refreshTokenAndReconnect = async () => {
    try {
      const response = await axios.post(baseUrl + "/api/auth/reissue", {
        grantType: "Bearer",
        accessToken: accessToken.accessToken,
        refreshToken: accessToken.refreshToken,
      });
      accessToken.setAccessToken(response.data.accessToken);
      accessToken.setRefreshToken(response.data.refreshToken);
      connectWebSocket(response.data.accessToken);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const connectWebSocket = (token) => {
    const newClient = new Client({
      webSocketFactory: () => new SockJS("https://i10e206.p.ssafy.io/api/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      beforeConnect: () => {
      },
      reconnectDelay: 0,
      onConnect: () => {
        setIsConnected(true);

        // 랭크 게임 매칭 성공 수신
        newClient.subscribe("/user/match/" + sessionStorage.getItem("email"), (message) => {
          const newMessage = message.body;
          const messageObject = JSON.parse(newMessage);
          // console.log(messageObject);
          // 메시지를 받았을 때 처리 (예: 상태 업데이트)
          setOpponentInfo(newMessage);
          setMatch(true);
          setGameId(messageObject.openviduSessionId);
        });
        newClient.subscribe("/message/invitations", (message) => {
          alert("알림: " + message.body);
        });

        newClient.subscribe("/message/alerts", (message) => {
          alert("알림: " + message.body);
        });

        // 메시지를 받을 대상 토픽 구독
        newClient.subscribe("/user/private-message", (message) => {
          const newMessage = JSON.parse(message.body);
          // 메시지를 받았을 때 처리 (예: 상태 업데이트)
          setMessages((prevMessages) => [newMessage, ...prevMessages]); // 최신 메시지가 앞에 오도록
        });

        // 사용자 목록 주제 구독
        newClient.subscribe("/message/users", (message) => {
          setUsers(JSON.parse(message.body)); // 사용자 목록 업데이트
        });

        // 웹소켓 연결 후 사용자 목록 요청
        newClient.publish({ destination: "/message/users" });

        // 메시지를 받을 대상 토픽 구독
        newClient.subscribe("/message/private-" + sessionStorage.getItem("email"), (message) => {
          const newMessage = JSON.parse(message.body);
          // 메시지를 받았을 때 처리 (예: 상태 업데이트)
          setReceivedMessages((prevMessages) => [newMessage, ...prevMessages]); // 최신 메시지가 앞에 오도록
        });
      },

      onDisconnect: () => {
      },
      onWebSocketClose: (closeEvent) => {
        if (accessToken.accessToken) {
          refreshTokenAndReconnect();
        }
      },
      onWebSocketError: (error) => {
      },

      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
    });

    setClient(newClient);
    newClient.activate();
  };

  useEffect(() => {
    if (!accessToken.accessToken) return;
    connectWebSocket(accessToken.accessToken);
  }, [accessToken.accessToken]);

  // 현재 접속 중인 유저 정보를 요청하는 함수
  // const currentUsers = () => {
  //   if (client && client.connected) {
  //     const response = client.send("/app/friends");
  //     return response.data;
  //   } else {
  //     console.log("WebSocket is not connected.");
  //   }
  // };

  return (
    <WebSocketContext.Provider value={{ client, match, gameId, setMatch, opponentInfo, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
