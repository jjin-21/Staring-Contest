import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import { toast, Slide, Bounce } from "react-toastify";
import { usePreventGoBackRoom } from "../hooks/usePreventGoBackRoom";
import axios from "axios";
import WaitingRoom from "../components/room/WaitingRoom";
import NormalGameLoading from "../components/room/NormalGameLoading";
import NormalGamePlay from "../components/room/NormalGamePlay";
import NormalGameResult from "../components/room/NormalGameResult";
import MicON from "../assets/img/room/MicOn.png";
import MicOFF from "../assets/img/room/MicOff.png";
import CameraON from "../assets/img/room/CameraOn.png";
import CameraOFF from "../assets/img/room/CameraOff.png";
import Chat from "../assets/img/room/Chat.png";
import Sound from "../assets/img/room/Sound.png";
import background_pirate from "../assets/img/background_pirate.png";
import HashLoader from "react-spinners/HashLoader";

const APPLICATION_SERVER_URL = "https://i10e206.p.ssafy.io/";

const Room = () => {
  usePreventGoBackRoom();
  // 사용자 닉네임, 방 세션 할당은 백엔드랑 통신할 때 수정하기
  // let { sessionId } = useParams();
  const { sessionId: roomId } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  // const { roomName, password, hastoken } = location.state;
  // const { roomName, password, hastoken } = location.state ?? {
  //   roomName: "",
  //   password: "",
  //   hastoken: "",
  // };
  const roomName = location.state?.roomName ?? "";
  const password = location.state?.password ?? "";
  const hastoken = location.state?.hastoken ?? "";
  const gameType = location.state?.gameType ?? "";

  // const roomName = location.state.roomName;
  const token = sessionStorage.getItem("accessToken");

  const [gameState, setGameState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [participantsReady, setParticipantsReady] = useState({});

  // 상태 전환 함수
  const changeGameState = (newState) => {
    setIsLoading(true); // 로딩 시작
    // 여기서 필요한 데이터 로딩 또는 처리
    // ...
    setGameState(newState); // 새 게임 상태 설정
    setIsLoading(false); // 로딩 완료
  };

  // 상태 및 참조 변수
  const [mySessionId, setMySessionId] = useState(roomId);
  const [myUserName, setMyUserName] = useState(sessionStorage.getItem("nickname"));
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  // 이 변수 switch camera 전용 변수? 확인하기
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  // 팀 A, B
  const [teamA, setTeamA] = useState(Array(4).fill(null));
  const [teamB, setTeamB] = useState(Array(4).fill(null));
  // 대기열
  const [teamW, setTeamW] = useState(Array(8).fill(null));
  // 클라이언트 정보
  const [myTeam, setMyTeam] = useState("");
  const [myStreamId, setMyStreamId] = useState("");
  // 클라이언트 영상, 마이크 제어
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  // 채팅
  const [chatMessages, setChatMessages] = useState([]);
  const [teamChatMessages, setTeamChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMode, setChatMode] = useState("all");
  // 아이템 사용
  const [itemVisible, setItemVisible] = useState(false);
  // 승패
  const [winTeam, setWinTeam] = useState("");
  // 상태 최신화 참조
  const myTeamRef = useRef(myTeam);
  const myStreamIdRef = useRef(myStreamId);
  const sessionRef = useRef(session);
  const teamARef = useRef(teamA);
  const teamBRef = useRef(teamB);
  const teamWRef = useRef(teamW);
  const participantsReadyRef = useRef(participantsReady);
  const mySessionIdRef = useRef(mySessionId);
  // OpenVidu 라이브러리 사용
  const OV = useRef(new OpenVidu());
  // 로그 에러만 출력
  OV.current.enableProdMode();

  // useEffect 훅
  useEffect(() => {
    myTeamRef.current = myTeam;
    myStreamIdRef.current = myStreamId;
    sessionRef.current = session;
    teamARef.current = teamA;
    teamBRef.current = teamB;
    teamWRef.current = teamW;
    participantsReadyRef.current = participantsReady;
    mySessionIdRef.current = mySessionId;
  }, [myTeam, myStreamId, session, teamA, teamB, teamW, participantsReady, mySessionId]);

  useEffect(() => {
    if (mySessionId && myUserName) {
      setIsLoading(true);
      joinSession();
      setTimeout(() => {
        setIsLoading(false);
        setGameState("waitingRoom");
      }, 1000);
    }
  }, [mySessionId, myUserName]);

  // useEffect(() => {
  //   if (winTeam) {
  //     const response = axios.patch(
  //       APPLICATION_SERVER_URL + "api/room",
  //       { roomId: roomId, status: false },
  //       {
  //         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  //       }
  //     );
  //     console.log(response);
  //   }
  // }, [winTeam]);

  useEffect(() => {
    if (session) {
      // Get a token from the OpenVidu deployment
      getToken2().then(async (token) => {
        try {
          await session
            .connect(token, {
              clientData: myUserName,
              clientProfile: sessionStorage.getItem("profile"),
            })
            .then(() => {
              requestTeamInfo();
            });

          let publisher = await OV.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "400x400",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          // session.publish(publisher);
          // 방 입장 시 대기열에 배치하기 위해 동기적 처리
          await session.publish(publisher);

          const devices = await OV.current.getDevices();
          const videoDevices = devices.filter((device) => device.kind === "videoinput");
          const currentVideoDeviceId = publisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setMainStreamManager(publisher);
          setPublisher(publisher);
          setCurrentVideoDevice(currentVideoDevice);
          // 방 입장 시 대기열에 배치
          handleSelectTeam(publisher.stream.streamId, "W");
          session.signal({
            data: JSON.stringify({ userName: myUserName, ready: false }),
            type: "ready",
          });
        } catch (error) {
        }
      });
    }
  }, [session, mySessionId, myUserName]);

  // 이벤트 핸들러
  // 카메라 토글
  const toggleCamera = useCallback(() => {
    const newCameraOn = !cameraOn;

    if (mainStreamManager) {
      mainStreamManager.publishVideo(newCameraOn);
      toast.dismiss();
      toast.success(`${newCameraOn ? "카메라 ON" : "카메라 OFF"}`, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    }

    setCameraOn(newCameraOn);
  }, [cameraOn, mainStreamManager]);

  // 마이크 토글
  const toggleMic = useCallback(() => {
    const newMicOn = !micOn;

    if (mainStreamManager) {
      mainStreamManager.publishAudio(newMicOn);
      toast.dismiss();
      toast.success(`${newMicOn ? "마이크 ON" : "마이크 OFF"}`, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    }
    setMicOn(newMicOn);
  }, [micOn, mainStreamManager]);

  // 채팅 메시지 전송 함수
  const sendChatMessage = () => {
    const message = {
      content: currentMessage,
      sender: myUserName,
      mode: chatMode, // 'all', 'A', 'B'
      timestamp: new Date().toISOString(),
    };

    session.signal({
      data: JSON.stringify(message),
      type: "chat",
    });

    setCurrentMessage("");
  };

  // 준비 상태 전송
  const sendReady = () => {
    const newReadyState = !ready;
    setReady(newReadyState);
    session.signal({
      data: JSON.stringify({ userName: myUserName, ready: newReadyState }),
      type: "ready",
    });
  };

  const sendStart = () => {
    session.signal({
      data: "",
      type: "start",
    });
  };

  const sendLose = () => {
    session.signal({
      data: myTeam,
      type: "lose",
    });
  };

  const chatProps = {
    chatMessages,
    teamChatMessages,
    currentMessage,
    chatMode,
    setChatMessages,
    setTeamChatMessages,
    setCurrentMessage,
    sendChatMessage,
    setChatMode,
  };

  // 팀 선택 핸들러
  const handleSelectTeam = (streamId, team) => {
    setMyTeam(team);
    setMyStreamId(streamId);
    updateTeamChoice(streamId, team);
    setChatMode("all");
    setTeamChatMessages([]);
    sendTeamChoice(streamId, team);
  };

  // 팀 선택 신호 보내기
  const sendTeamChoice = (streamId, team) => {
    session.signal({
      data: JSON.stringify({ streamId, team }),
      type: "team-choice",
    });
  };

  // 팀 선택 업데이트
  const updateTeamChoice = (streamId, team) => {
    const replaceStreamIdWithNull = (teamArray, oldStreamId, type) => {
      let newArray = [...teamArray];
      const index = newArray.indexOf(oldStreamId);

      // oldStreamId가 있는 경우, 해당 위치에서 제거
      if (index !== -1) {
        newArray.splice(index, 1);
      }

      // 배열의 크기를 유지하기 위해 null 추가
      while (newArray.length < (type === 1 ? 4 : 8)) {
        newArray.push(null);
      }

      return newArray;
    };

    const updateTeamArray = (teamArray, newStreamId) => {
      const newArray = [...teamArray];
      const nullIndex = newArray.indexOf(null);
      if (newArray.includes(newStreamId)) {
        // 이미 배열에 streamId가 있으면 아무것도 하지 않음
        return newArray;
      } else if (nullIndex !== -1) {
        // null 값을 찾아서 새 streamId로 교체
        newArray[nullIndex] = newStreamId;
        return newArray;
      } else {
        // 모든 자리가 차있으면 새 streamId를 추가하지 않음
        return newArray;
      }
    };

    if (team === "A" && !isTeamFull(teamA)) {
      setTeamB((prev) => replaceStreamIdWithNull(prev, streamId, 1)); // 다른 팀에서 현재 streamId를 null로 대체
      setTeamW((prev) => replaceStreamIdWithNull(prev, streamId, 0));
      setTeamA((prev) => updateTeamArray(prev, streamId)); // 현재 팀에 streamId 추가
    } else if (team === "B" && !isTeamFull(teamB)) {
      setTeamA((prev) => replaceStreamIdWithNull(prev, streamId, 1));
      setTeamW((prev) => replaceStreamIdWithNull(prev, streamId, 0));
      setTeamB((prev) => updateTeamArray(prev, streamId));
    } else if (team === "W" && !isTeamFull2(teamW)) {
      setTeamA((prev) => replaceStreamIdWithNull(prev, streamId, 1));
      setTeamB((prev) => replaceStreamIdWithNull(prev, streamId, 1));
      setTeamW((prev) => updateTeamArray(prev, streamId));
    }
  };

  // 새 사용자가 세션에 접속할 때 팀 정보 요청 신호 보내기
  const requestTeamInfo = () => {
    session.signal({
      data: "", // 필요한 경우 추가 데이터 전송
      type: "team-info-request",
    });

    session.signal({
      data: "",
      type: "ready-info-request",
    });
  };

  const useItem = () => {
    session.signal({
      data: myUserName,
      type: "useitem",
    });
  };

  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession();

    mySession.on("streamCreated", (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    // 채팅 이벤트 리스너 설정
    mySession.on("signal:chat", (event) => {
      const receivedMessage = JSON.parse(event.data);
      // 전체 채팅 추가
      if (receivedMessage.mode === "all") {
        setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } else if (receivedMessage.mode === myTeamRef.current) {
        setTeamChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    });

    mySession.on("signal:start", () => {
      // const response = await axios.patch(
      //   APPLICATION_SERVER_URL + "api/room",
      //   { roomId: mySessionIdRef.current, status: true },
      //   {
      //     headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      //   }
      // );
      // console.log(response);
      setGameState("gameLoading");
      setTimeout(() => {
        setGameState("gamePlay");
      }, 5000);
    });

    mySession.on("signal:ready", (event) => {
      const { userName, ready } = JSON.parse(event.data);
      setParticipantsReady((prev) => ({ ...prev, [userName]: ready }));
    });

    mySession.on("signal:ready-info-request", (event) => {
      const currentUser = JSON.parse(mySession.connection.data).clientData;
      const newUser = JSON.parse(event.from.data).clientData;
      if (currentUser !== newUser) {
        sessionRef.current.signal({
          data: JSON.stringify(participantsReadyRef.current),
          type: "ready-info-response",
        });
      }
    });

    mySession.on("signal:ready-info-response", (event) => {
      const participantsReady = JSON.parse(event.data);
      setParticipantsReady(participantsReady);
    });

    // 팀 선택 수신
    mySession.on("signal:team-choice", (event) => {
      const { streamId, team } = JSON.parse(event.data);
      updateTeamChoice(streamId, team);
    });

    // 기존 사용자가 팀 정보 요청 신호 수신 시 응답2
    mySession.on("signal:team-info-request", (event) => {
      const currentUser = JSON.parse(mySession.connection.data).clientData;
      const newUser = JSON.parse(event.from.data).clientData;

      if (currentUser !== newUser) {
        toast.info(newUser + "님이 입장하셨습니다.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        if (myTeamRef.current === "A" || myTeamRef.current === "B") {
          const index =
            myTeamRef.current === "A"
              ? teamARef.current.indexOf(myStreamIdRef.current)
              : teamBRef.current.indexOf(myStreamIdRef.current);
          sessionRef.current.signal({
            data: JSON.stringify({
              streamId: myStreamIdRef.current,
              team: myTeamRef.current,
              index,
            }),
            type: "team-info-response",
            to: [event.from],
          });
        } else if (myTeamRef.current === "W") {
          const index = teamWRef.current.indexOf(myStreamIdRef.current);
          sessionRef.current.signal({
            data: JSON.stringify({ streamId: myStreamIdRef.current, team: "W", index }),
            type: "team-info-response",
            to: [event.from],
          });
        }
      }
    });

    // 새 사용자가 팀 정보 응답 신호 수신
    mySession.on("signal:team-info-response", (event) => {
      const { streamId, team, index } = JSON.parse(event.data);

      if (team === "A") {
        setTeamA((prev) => {
          const newTeamA = [...prev];
          newTeamA[index] = streamId;
          return newTeamA;
        });
      } else if (team === "B") {
        setTeamB((prev) => {
          const newTeamB = [...prev];
          newTeamB[index] = streamId;
          return newTeamB;
        });
      } else if (team === "W") {
        setTeamW((prev) => {
          const newTeamW = [...prev];
          if (newTeamW[index] === null) {
            newTeamW[index] = streamId;
          } else {
            newTeamW[index + 1] = streamId;
          }
          return newTeamW;
        });
      }
    });

    mySession.on("signal:useitem", (event) => {
      const username = event.data;
      if (username !== myUserName) {
        setItemVisible(true);
        setTimeout(() => {
          setItemVisible(false);
        }, 5000);
      }
    });

    setSession(mySession);
  }, []);

  const leaveSession = useCallback(async () => {
    // Leave the session
    if (session) {
      const response = await axios.delete(APPLICATION_SERVER_URL + `api/room/${roomId}`, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      session.disconnect();
    }

    // Reset all states and OpenVidu object
    // OV.current = new OpenVidu();
    // setSession(undefined);
    // setSubscribers([]);
    // setMySessionId("");
    // setMyUserName("");
    // setMainStreamManager(undefined);
    // setPublisher(undefined);
    // setTeamA(Array(4).fill(null));
    // setTeamB(Array(4).fill(null));
    // setTeamW(Array(8).fill(null));
    // setGameState("");

    // navigate("/lobby");
  }, [session]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      leaveSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [leaveSession]);

  const deleteSubscriber = useCallback((streamManager) => {
    // 제거할 스트림 ID 추출
    const streamIdToRemove = streamManager.stream.streamId;

    // 준비완료 객체에서 제거
    const leavingUserName = JSON.parse(streamManager.stream.connection.data).clientData;
    setParticipantsReady((prevParticipantsReady) => {
      const updatedParticipantsReady = { ...prevParticipantsReady };
      delete updatedParticipantsReady[leavingUserName];
      return updatedParticipantsReady;
    });

    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager);
      if (index > -1) {
        const newSubscribers = [...prevSubscribers];
        newSubscribers.splice(index, 1);
        return newSubscribers;
      } else {
        return prevSubscribers;
      }
    });

    // TeamA 배열에서 해당 사용자를 null로 대체
    setTeamA((prevTeamA) => {
      const index = prevTeamA.indexOf(streamIdToRemove);
      if (index !== -1) {
        const newTeamA = [...prevTeamA];
        // newTeamA[index] = null;
        newTeamA.splice(index, 1);
        while (newTeamA.length < 4) {
          newTeamA.push(null);
        }
        return newTeamA;
      } else {
        return prevTeamA;
      }
    });

    // TeamB 배열에서 해당 사용자를 null로 대체
    setTeamB((prevTeamB) => {
      const index = prevTeamB.indexOf(streamIdToRemove);
      if (index !== -1) {
        const newTeamB = [...prevTeamB];
        // newTeamB[index] = null;
        newTeamB.splice(index, 1);
        while (newTeamB.length < 4) {
          newTeamB.push(null);
        }
        return newTeamB;
      } else {
        return prevTeamB;
      }
    });

    setTeamW((prevTeamW) => {
      const index = prevTeamW.indexOf(streamIdToRemove);
      if (index !== -1) {
        const newTeamW = [...prevTeamW];
        // newTeamW[index] = null;
        newTeamW.splice(index, 1);
        while (newTeamW.length < 8) {
          newTeamW.push(null);
        }
        return newTeamW;
      } else {
        return prevTeamW;
      }
    });
  }, []);

  const getToken2 = async () => {
    if (hastoken) {
      return hastoken;
    }
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/room/enter",
        { roomId: roomId, password: password },
        {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        }
      );
      return response.data.connectionToken; // The token
    } catch (error) {
    }
  };

  // const getToken = useCallback(async () => {
  //   return createSession(mySessionId).then((sessionId) => createToken(sessionId));
  // }, [mySessionId]);

  // const createSession = async (sessionId) => {
  //   const response = await axios.post(
  //     APPLICATION_SERVER_URL + "api/sessions",
  //     { customSessionId: sessionId },
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  //   return response.data; // The sessionId
  // };

  // const createToken = async (sessionId) => {
  //   const response = await axios.post(
  //     APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
  //     {},
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  //   return response.data; // The token
  // };

  // 유틸리티 함수,
  const isTeamFull = (team) => team.filter((id) => id !== null).length >= 4;
  const isTeamFull2 = (team) => team.filter((id) => id !== null).length >= 8;

  // 라우팅 구성
  return (
    <>
      {isLoading && (
        <div
          className="h-screen flex flex-col justify-center items-center text-center"
          style={{
            backgroundImage: `url(${background_pirate})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <HashLoader color="#dddddd" size={150} speedMultiplier={2} />
        </div>
      )}
      {!isLoading && gameState === "waitingRoom" && (
        <WaitingRoom
          roomName={roomName}
          gameType={gameType}
          publisher={publisher}
          subscribers={subscribers}
          mySessionId={mySessionId}
          myStreamId={myStreamId}
          myUserName={myUserName}
          myTeam={myTeam}
          teamA={teamA}
          teamB={teamB}
          teamW={teamW}
          cameraOn={cameraOn}
          micOn={micOn}
          toggleCamera={toggleCamera}
          toggleMic={toggleMic}
          leaveSession={leaveSession}
          handleSelectTeam={handleSelectTeam}
          isTeamFull={isTeamFull}
          isTeamFull2={isTeamFull2}
          MicON={MicON}
          MicOFF={MicOFF}
          CameraON={CameraON}
          CameraOFF={CameraOFF}
          Chat={Chat}
          Sound={Sound}
          {...chatProps}
          ready={ready}
          sendReady={sendReady}
          participantsReady={participantsReady}
          setGameState={setGameState}
          sendStart={sendStart}
        />
      )}
      {!isLoading && gameState === "gameLoading" && (
        <NormalGameLoading
          gameType={gameType}
          publisher={publisher}
          subscribers={subscribers}
          teamA={teamA}
          teamB={teamB}
        />
      )}
      {!isLoading && gameState === "gamePlay" && (
        <NormalGamePlay
          session={session}
          gameType={gameType}
          publisher={publisher}
          subscribers={subscribers}
          teamA={teamA}
          teamB={teamB}
          setGameState={setGameState}
          sendLose={sendLose}
          setWinTeam={setWinTeam}
          itemVisible={itemVisible}
          useItem={useItem}
        />
      )}
      {!isLoading && gameState === "gameResult" && (
        <NormalGameResult
          winTeam={winTeam}
          teamA={teamA}
          teamB={teamB}
          setGameState={setGameState}
          setWinTeam={setWinTeam}
          sendReady={sendReady}
          myTeam={myTeam}
        />
      )}
    </>
  );
};

export default Room;
