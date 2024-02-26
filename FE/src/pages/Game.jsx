import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import { usePreventBrowserControl } from "../hooks/usePreventBrowserControl";
import { useAccessTokenState } from "@/context/AccessTokenContext";
import { toast, Slide, Bounce } from "react-toastify";
import axios from "axios";
// 게임 매칭 화면(일반 / 랭크 case로 구분)
import GameLoading from "../components/game/GameLoading";
import GamePlay from "../components/game/GamePlay";
import GameResult from "../components/game/GameResult";
import background_pirate from "../assets/img/background_pirate.png";
import HashLoader from "react-spinners/HashLoader";

const APPLICATION_SERVER_URL = "https://i10e206.p.ssafy.io/";

const Game = () => {
  usePreventBrowserControl();
  // 사용자 닉네임, 방 세션 할당은 백엔드랑 통신할 때 수정하기
  // let { sessionId } = useParams();
  const { sessionId: gameId } = useParams();
  const location = useLocation();
  const { gameType, opponentInfo } = location.state;
  const opponentInfoParsed = JSON.parse(opponentInfo);
  const myInfo = useAccessTokenState();
  const token = sessionStorage.getItem("accessToken");
  const myClassicPoint = sessionStorage.getItem("classicPt");
  const prevClassicPoint = myInfo.classicPt;
  const myItemPoint = sessionStorage.getItem("itemPt");
  const prevItemPoint = myInfo.itemPt;

  const [gameState, setGameState] = useState("entrance");
  const [isLoading, setIsLoading] = useState(false);

  // 게임 상태 전환 함수
  const changeGameState = (newState) => {
    setIsLoading(true); // 로딩 시작
    // 여기서 필요한 데이터 로딩 또는 처리
    // ...
    setGameState(newState); // 새 게임 상태 설정
    setIsLoading(false); // 로딩 완료
  };

  // 상태 및 참조 변수
  const [mySessionId, setMySessionId] = useState(gameId);
  const [myUserName, setMyUserName] = useState(sessionStorage.getItem("nickname"));
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscriber, setSubscriber] = useState(undefined);

  // 게임 준비완료 상태
  const [ready, setReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  // 패배 상태
  const [myLose, setMyLose] = useState(false);
  const [opponentLose, setOpponentLose] = useState(false);
  const [myWin, setMyWin] = useState(null);
  // 재도전 요청
  const [rematchRequest, setRematchRequest] = useState(false);
  const [rematchResponse, setRematchResponse] = useState(false);
  const [rematch, setRematch] = useState(false);
  // 아이템 사용
  const [itemVisible, setItemVisible] = useState(false);
  // 게임 승/패 점수
  const expectedWinPt = opponentInfoParsed.expectedWinPt;
  const expectedLosePt = opponentInfoParsed.expectedLosePt;

  // 이 변수 switch camera 전용 변수? 확인하기
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  // 상태 최신화 참조
  const sessionRef = useRef(session);
  const mySessionIdRef = useRef(mySessionId);
  const myWinRef = useRef(myWin);

  // OpenVidu 라이브러리 사용
  const OV = useRef(new OpenVidu());
  OV.current.enableProdMode();

  useEffect(() => {
    if (mySessionId && myUserName) {
      setIsLoading(true);
      joinSession();
      // setTimeout(() => {
      //   setIsLoading(false);
      //   setGameState("gameLoading");
      //   setTimeout(() => {
      //     setGameState("gamePlay");
      //   }, 3000); // "gameLoading" 후 3초 뒤에 "gamePlay"로 변경
      // }, 2000);
    }
  }, [mySessionId, myUserName]);

  useEffect(() => {
    if (publisher && subscriber) {
      setIsLoading(false);
      setGameState("gameLoading");
      setTimeout(() => {
        setGameState("gamePlay");
      }, 5000);
    }
  }, [publisher, subscriber]);

  // useEffect 훅
  useEffect(() => {
    sessionRef.current = session;
    mySessionIdRef.current = mySessionId;
    myWinRef.current = myWin;
  }, [session, mySessionId, myWin]);

  useEffect(() => {
    if (myWinRef.current === null && (myLose || opponentLose)) {
      if (myLose && myWinRef.current === null) {
        setMyWin(false);
        if (gameType === "classic") {
          updatePoint(expectedLosePt, 0);
          myInfo.setClassicPt(Number(myInfo.classicPt) + Number(expectedLosePt));
          myInfo.setLoseNumClassic(Number(myInfo.loseNumClassic) + 1);
        } else {
          updatePoint(0, expectedLosePt);
          myInfo.setItemPt(Number(myInfo.itemPt) + Number(expectedLosePt));
          myInfo.setLoseNumItem(Number(myInfo.loseNumItem) + 1);
        }
      } else if (opponentLose && myWinRef.current === null) {
        setMyWin(true);
        if (gameType === "classic") {
          updatePoint(expectedWinPt, 0);
          myInfo.setClassicPt(Number(myInfo.classicPt) + Number(expectedWinPt));
          myInfo.setWinNumClassic(Number(myInfo.winNumClassic) + 1);
          updateResult(false, myInfo.nickname, opponentInfoParsed.nickname);
        } else {
          updatePoint(0, expectedWinPt);
          myInfo.setItemPt(Number(myInfo.itemPt) + Number(expectedWinPt));
          myInfo.setWinNumItem(Number(myInfo.winNumItem) + 1);
          updateResult(true, myInfo.nickname, opponentInfoParsed.nickname);
        }
      }
      setTimeout(() => {
        setGameState("gameResult");
      }, 2000);
    }
  }, [myLose, opponentLose]);

  useEffect(() => {
    if (session) {
      // Get a token from the OpenVidu deployment
      getToken2().then(async (token) => {
        try {
          await session.connect(token, { clientData: myUserName });

          let publisher = await OV.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: false,
            publishVideo: true,
            resolution: "400x400",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: true,
          });

          session.publish(publisher);

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
        } catch (error) {
        }
      });
    }
  }, [session, myUserName]);

  // // 마이크 토글
  // const toggleMic = useCallback(() => {
  //   const newMicOn = !micOn;

  //   if (mainStreamManager) {
  //     mainStreamManager.publishAudio(newMicOn);
  //     toast.dismiss();
  //     toast.success(`${newMicOn ? "마이크 ON" : "마이크 OFF"}`, {
  //       position: "top-center",
  //       autoClose: 500,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "colored",
  //       transition: Slide,
  //     });
  //   }
  //   setMicOn(newMicOn);
  // }, [micOn, mainStreamManager]);

  // 게임 준비 완료 신호 보내기
  const sendReady = () => {
    session.signal({
      data: myUserName,
      type: "ready",
    });
  };

  const sendLose = () => {
    session.signal({
      data: myUserName,
      type: "lose",
    });
  };

  const sendRematch = () => {
    setRematchRequest(true);
    session.signal({
      data: myUserName,
      type: "rematch",
    });
  };

  const acceptRematch = () => {
    setRematch(true);
    session.signal({
      data: myUserName,
      type: "accept",
    });
  };

  const useItem = () => {
    session.signal({
      data: myUserName,
      type: "useitem",
    });
  };

  // // 새 사용자가 세션에 접속할 때 팀 정보 요청 신호 보내기
  // const requestTeamInfo = () => {
  //   session.signal({
  //     data: "", // 필요한 경우 추가 데이터 전송
  //     type: "team-info-request",
  //   });
  // };

  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession();

    mySession.on("streamCreated", (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscriber(subscriber);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession.on("signal:ready", (event) => {
      const username = event.data;
      if (username !== myUserName) {
        setOpponentReady(true);
      }
    });

    mySession.on("signal:lose", (event) => {
      const username = event.data;
      if (username === myUserName) {
        setMyLose(true);
      } else if (username !== myUserName) {
        setOpponentLose(true);
      }
    });

    mySession.on("signal:rematch", (event) => {
      const username = event.data;
      if (username !== myUserName) {
        setRematchResponse(true);
      }
    });

    mySession.on("signal:accept", (event) => {
      const username = event.data;
      if (username !== myUserName) {
        setRematch(true);
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

  const leaveSession = useCallback(() => {
    // Leave the session
    if (session) {
      session.disconnect();
    }

    // Reset all states and OpenVidu object
    OV.current = new OpenVidu();
    setSession(undefined);
    setSubscriber(undefined);
    setMySessionId("");
    setMyUserName("");
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);

  const deleteSubscriber = useCallback((streamManager) => {
    setSubscriber(streamManager);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      leaveSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [leaveSession]);

  const updatePoint = async (classicPt, itemPt) => {
    const response = await axios.patch(
      APPLICATION_SERVER_URL + "api/point",
      { classicPt: classicPt, itemPt: itemPt },
      {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      }
    );
  };

  const updateResult = async (isItem, winner, loser) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/game-result",
      {
        isItem: isItem,
        userWinnerNickname: winner,
        userLoserNickname: loser,
      },
      {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      }
    );
  };

  const getToken2 = async () => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/point/enter",
      { gameId: gameId },
      {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      }
    );
    return response.data.token; // The token
  };

  const getToken = useCallback(async () => {
    return createSession(mySessionId).then((sessionId) => createToken(sessionId));
  }, [mySessionId]);

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The token
  };

  const gameProps = {
    ready,
    setReady,
    opponentReady,
    sendReady,
    sendLose,
    myLose,
    opponentLose,
    gameType,
    itemVisible,
    useItem,
  };

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
      {!isLoading && gameState === "gameLoading" && (
        <GameLoading
          publisher={publisher}
          subscriber={subscriber}
          gameType={gameType}
          opponentInfoParsed={opponentInfoParsed}
        />
      )}
      {!isLoading && gameState === "gamePlay" && (
        <GamePlay
          publisher={publisher}
          subscriber={subscriber}
          {...gameProps}
          opponentInfoParsed={opponentInfoParsed}
          myWin={myWin}
        />
      )}
      {!isLoading && gameState === "gameResult" && (
        <GameResult
          myLose={myLose}
          opponentLose={opponentLose}
          myWin={myWin}
          leaveSession={leaveSession}
          sendRematch={sendRematch}
          acceptRematch={acceptRematch}
          rematchRequest={rematchRequest}
          rematchResponse={rematchResponse}
          rematch={rematch}
          gameId={gameId}
          gameType={gameType}
          opponentInfoParsed={opponentInfoParsed}
          setGameState={setGameState}
          setReady={setReady}
          setOpponentReady={setOpponentReady}
          setMyLose={setMyLose}
          setOpponentLose={setOpponentLose}
          setMyWin={setMyWin}
          setRematchRequest={setRematchRequest}
          setRematchResponse={setRematchResponse}
          setRematch={setRematch}
          prevClassicPoint={prevClassicPoint}
          prevItemPoint={prevItemPoint}
        />
      )}
    </>
  );
};

export default Game;
