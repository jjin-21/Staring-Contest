import { useEffect, useState, useRef } from "react";
import UserVideoComponent from "./UserVideoComponent";
import OpponentVideoComponent from "./OpponentVideoComponent";
import background_magma2 from "../../assets/img/background_magma2.gif";
import game_waiting from "../../assets/img/game_waiting.png";
import ready_button from "../../assets/img/ready_button.png";
import { SFX, playSFX } from "../../utils/audioManager";

const GamePlay = ({
  publisher,
  subscriber,
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
  streamManager,
  opponentInfoParsed,
  myWin,
}) => {
  const [gameState, setGameState] = useState("waiting");
  const [time, setTime] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(3);
  const [canUse, setCanUse] = useState(true);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [shake, setShake] = useState(false);
  const [availableAnimations, setAvailableAnimations] = useState([]);
  const [animationClass, setAnimationClass] = useState("");
  const [itemUsed, setItemUsed] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const initialAnimations = [
    "animate-spin animate-infinite animate-duration-[600ms]",
    "animate-ping animate-infinite animate-duration-[600ms]",
    "animate-fade animate-infinite animate-duration-[600ms]",
    "animate-wiggle-more animate-infinite animate-duration-[50ms]",
    "animate-jump-out animate-infinite animate-duration-[600ms]",
    "animate-bounce animate-infinite animate-duration-100",
  ];

  useEffect(() => {
    if (isLoading) {
      playSFX(SFX.COUNTDOWN);
    }
  }, [isLoading]);

  useEffect(() => {
    if (itemVisible) {
      playSFX(SFX.ITEM);
    }
  }, [itemVisible]);

  useEffect(() => {
    // 사용 가능한 애니메이션 목록이 비었을 경우, 초기 목록으로 재설정
    if (availableAnimations.length === 0) {
      setAvailableAnimations([...initialAnimations]);
    }

    if (itemVisible && availableAnimations.length > 0) {
      // 사용 가능한 애니메이션 중에서 랜덤으로 하나 선택
      const randomIndex = Math.floor(Math.random() * availableAnimations.length);
      const selectedAnimation = availableAnimations[randomIndex];
      setAnimationClass(selectedAnimation);

      // 선택된 애니메이션을 사용 가능한 목록에서 제거
      const updatedAvailableAnimations = availableAnimations.filter(
        (_, index) => index !== randomIndex
      );
      setAvailableAnimations(updatedAvailableAnimations);
    } else {
      // 아이템이 보이지 않을 경우 애니메이션 클래스 초기화
      setAnimationClass("");
    }
  }, [itemVisible]);

  useEffect(() => {
    let countdownInterval;

    if (ready && opponentReady) {
      setTimeout(() => {
        setIsLoading(true);

        countdownInterval = setInterval(() => {
          setTime((prevTime) => {
            if (prevTime > 1) {
              return prevTime - 1;
            } else {
              clearInterval(countdownInterval);
              setIsLoading(false);
              setGameState("play");
              return 0;
            }
          });
        }, 1000);
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [ready, opponentReady]);

  useEffect(() => {
    let interval;

    if (gameState === "play" && gameStartTime === null) {
      setGameStartTime(Date.now());
    }

    if (gameState === "play") {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - gameStartTime);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState, gameStartTime]);

  useEffect(() => {
    if (gameState === "play" && gameType === "classic") {
      setTimeout(() => {
        setShake(true); // 10초 후에 shake 상태를 true로 설정
      }, 10000);
    }
  }, [gameState]); // gameState가 변경될 때마다 이 효과를 재실행

  const gameProps = {
    sendLose,
    myLose,
    opponentLose,
  };

  // 밀리초 단위의 elapsedTime를 분과 초로 변환
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = ((elapsedTime % 60000) / 1000).toFixed(0);

  return (
    <>
      <div
        className="h-screen flex justify-center items-center text-center"
        style={{
          backgroundImage: `url(${background_magma2})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {isLoading && (
          <div className="flex-col">
            <div
              className="text-3xl animate-bounce p-2"
              style={{
                backgroundImage: `url(${game_waiting})`,
                backgroundSize: "110% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                fontSize: "20px",
              }}
            >
              잠시 후 게임이 시작됩니다!!
            </div>
            <div className="text-6xl text-red-500 animate-ping">{time}</div>
          </div>
        )}
        {!isLoading && gameState === "waiting" && (
          <div className="flex-col ">
            <div
              style={{
                backgroundImage: `url(${game_waiting})`,
                backgroundSize: "80% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                fontSize: "20px",
              }}
            >
              아래의 준비완료 버튼을 눌러주세요
            </div>
            <div className=" ">
              <UserVideoComponent streamManager={publisher} gameState={gameState} />
            </div>
            <div className="text-center ">
              <button
                onClick={() => {
                  setReady(true);
                  sendReady();
                }}
                className={`m-3 p-3 border-4 rounded-xl text-xl ${ready ? "border-green-600" : "border-transparent"}`}
                style={{
                  backgroundImage: `url(${ready_button})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  fontSize: "20px",
                }}
              >
                준비
              </button>
            </div>
            <div className="text-center">
              <span
                className={`m-3 p-3 border-4 rounded-xl text-xl ${opponentReady ? "border-green-600" : "border-transparent"} `}
                style={{
                  backgroundImage: `url(${ready_button})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  fontSize: "20px",
                }}
              >
                상대방 준비 완료
              </span>
            </div>
          </div>
        )}
        {!isLoading && gameState === "play" && (
          <div>
            {!isLoading && gameState === "play" && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="text-center">
                  {/* {myLose ? (
                    <div className="text-30vw text-red-500 font-bold drop-animation">LOSE</div>
                  ) : opponentLose ? (
                    <div className="text-10vw text-green-500 font-bold drop-animation">WIN</div>
                  ) : (
                    ""
                  )} */}
                  {myWin === false ? (
                    <div className="text-30vw text-red-500 font-bold drop-animation">LOSE</div>
                  ) : myWin === true ? (
                    <div className="text-30vw text-green-500 font-bold drop-animation">WIN</div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            <div
              className="text-5vw text-white bg-black absolute border-4 border-red-500 rounded-full p-5"
              style={{ top: "10%", left: "50%", transform: "translate(-50%, -50%)" }}
            >
              게임 진행 시간
              <br /> " {minutes}분 {seconds}초 "
            </div>
            {gameType === "classic" ? (
              ""
            ) : (
              <div className="flex flex-col gap-1">
                <div
                  className={`text-white text-5vw ${itemUsed && "animate-ping animate-twice animate-duration-1000"}`}
                >
                  아이템 수량 : {itemCount}
                </div>
                {gameType === "classic"
                  ? ""
                  : canUse && (
                      <div className="text-xs text-white">영상을 터치하면 아이템이 사용됩니다</div>
                    )}

                {!canUse && (
                  <div className="flex flex-col justify-center items-center gap-1">
                    <div className="rounded-xl bg-gray-400"> 재사용 대기 시간</div>
                    <div className="bg-gray-200 h-4 rounded-full overflow-hidden gauge-bar-container">
                      <div className="bg-gray-600 h-full gauge-bar" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="invisible absolute">
              <UserVideoComponent streamManager={publisher} gameState={gameState} {...gameProps} />
            </div>
            <div
              className="flex flex-col items-center justify-center"
              onClick={() => {
                if (gameType === "item" && itemCount > 0 && canUse) {
                  setItemCount(itemCount - 1);
                  setItemUsed(true);
                  setCanUse(false);
                  useItem();
                  setTimeout(() => {
                    setCanUse(true);
                    setItemUsed(false);
                  }, 5000);
                }
              }}
            >
              <div className={`${animationClass} ${shake ? "shake" : ""}`}>
                <OpponentVideoComponent
                  streamManager={subscriber}
                  opponentInfoParsed={opponentInfoParsed}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GamePlay;
