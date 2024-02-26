import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TitleBar from "@/assets/img/gameResult/TitleBar.png";
import MiddleBackground from "@/assets/img/gameResult/MiddleBackground.png";
import ContinueBackground from "@/assets/img/gameResult/ContinueBackground.png";
import RankPointBackground from "@/assets/img/gameResult/RankPointBackground.png";
import NicknameTitle from "@/assets/img/gameResult/NicknameTitle.png";
import RankingTitle from "@/assets/img/gameResult/RankingTitle.png";
import gameApiCall from "@/api/axios/gameApiCall";
import { SFX, playSFX } from "../../utils/audioManager";

const GameResult = ({
  myLose,
  opponentLose,
  myWin,
  leaveSession,
  sendRematch,
  acceptRematch,
  rematchRequest,
  rematchResponse,
  rematch,
  gameId,
  gameType,
  opponentInfoParsed,
  setGameState,
  setReady,
  setOpponentReady,
  setMyLose,
  setOpponentLose,
  setMyWin,
  setRematchRequest,
  setRematchResponse,
  setRematch,
  prevClassicPoint,
  prevItemPoint,
}) => {
  const [resultState, setResultState] = useState("phase1");
  const [progress, setProgress] = useState(100);
  const [rankings, setRankings] = useState("");
  const useGameApiCall = gameApiCall();
  const [isFirstEffectCompleted, setIsFirstEffectCompleted] = useState(false);
  const myClassicPoint = sessionStorage.getItem("classicPt");
  const myItemPoint = sessionStorage.getItem("itemPt");
  const expectedWinPt = opponentInfoParsed.expectedWinPt;
  const expectedLosePt = opponentInfoParsed.expectedLosePt;
  const [nowPoint, setNowPoint] = useState(0);
  const [accessPoint, setAccessPoint] = useState(0);
  const finalPoint = nowPoint + accessPoint;
  const finalAccessPoint = 0;

  useEffect(() => {
    const getRanking = async () => {
      const ranking = await useGameApiCall.getRanking(gameType);
      setRankings(ranking);
    };

    getRanking();
  }, []);

  useEffect(() => {
    if (myWin === true) {
      playSFX(SFX.WIN);
    } else if (myWin === false) {
      playSFX(SFX.LOSE);
    }
  }, [myWin]);

  useEffect(() => {
    // rematchRequest나 rematchResponse가 변경될 때 phase2로 설정
    if (rematchRequest || rematchResponse) {
      setResultState("phase2");
    }
  }, [rematchRequest, rematchResponse]);

  // useEffect(() => {
  //   let timer;
  //   // resultState가 phase1이나 phase2일 때만 3초 타이머 설정
  //   if (resultState === "phase1" || resultState === "phase2") {
  //     timer = setTimeout(() => {
  //       if (resultState !== "phase3") {
  //         setResultState("phase3");
  //       }
  //     }, 3000);
  //   }

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [resultState]);

  useEffect(() => {
    if (resultState === "phase1" || resultState === "phase2") {
      setProgress(100); // phase1 또는 phase2로 진입할 때 진행 바를 다시 채웁니다.
      const interval = setInterval(() => {
        setProgress((prevProgress) => (prevProgress > 0 ? prevProgress - 1 : 0));
      }, 40); // 매 10밀리초마다 진행 바 감소

      // 3초 후에 자동으로 phase3로 설정
      const timeout = setTimeout(() => {
        setResultState("phase3");
        clearInterval(interval); // 타이머 정지
        setProgress(0); // 진행 바를 0으로 설정
      }, 4000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [resultState]);

  useEffect(() => {
    if (rematch) {
      // rematch 상태가 true면 게임 페이지로 리다이렉트
      // navigate(`/game/${gameId}`, { state: { gameType: gameType, opponentInfo: opponentInfo } });
      // window.location.reload();
      setReady(false);
      setOpponentReady(false);
      setMyLose(false);
      setOpponentLose(false);
      setMyWin(null);
      setRematchRequest(false);
      setRematchResponse(false);
      setRematch(false);
      setResultState("phase1");
      setGameState("gamePlay");
    }
  }, [rematch]);

  //랭크 점수 출력하는 로직

  useEffect(() => {
    if (gameType === "classic") {
      if (myWin) {
        setNowPoint(parseInt(myClassicPoint) - parseInt(expectedWinPt));
        setAccessPoint(parseInt(expectedWinPt));
      } else {
        setNowPoint(parseInt(myClassicPoint) - parseInt(expectedLosePt));
        setAccessPoint(parseInt(expectedLosePt));
      }
    } else {
      if (myWin) {
        setNowPoint(parseInt(myItemPoint) - parseInt(expectedWinPt));
        setAccessPoint(parseInt(expectedWinPt));
      } else {
        setNowPoint(parseInt(myItemPoint) - parseInt(expectedLosePt));
        setAccessPoint(parseInt(expectedLosePt));
      }
    }
    setIsFirstEffectCompleted(true);
  }, [myClassicPoint, myItemPoint]);

  useEffect(() => {
    if (isFirstEffectCompleted) {
      setTimeout(() => {
        if (nowPoint < finalPoint) {
          const interval = setInterval(() => {
            setNowPoint((prevNumber) => (prevNumber < finalPoint ? prevNumber + 1 : prevNumber));
            setAccessPoint((prevNumber) =>
              prevNumber > finalAccessPoint ? prevNumber - 1 : prevNumber
            );

            if (nowPoint >= finalPoint && accessPoint <= finalAccessPoint) {
              clearInterval(interval);
            }
          }, 50);

          return () => clearInterval(interval);
        } else {
          const interval = setInterval(() => {
            setNowPoint((prevNumber) => (prevNumber > finalPoint ? prevNumber - 1 : prevNumber));
            setAccessPoint((prevNumber) =>
              prevNumber < finalAccessPoint ? prevNumber + 1 : prevNumber
            );

            if (nowPoint <= finalPoint && accessPoint >= finalAccessPoint) {
              clearInterval(interval);
            }
          }, 50);

          return () => clearInterval(interval);
        }
      }, 1000);
    }
  }, [isFirstEffectCompleted]);

  return (
    <div
      className="boxControl flex flex-col items-center animate-fade-left animate-once"
      style={{ backgroundColor: "#69492E", height: "100vh" }}
    >
      {/*Top*/}
      <div
        style={{
          background: `url(${TitleBar}) no-repeat`,
          backgroundPosition: "center center",
          backgroundSize: "50vw 15vh",
          width: "50vw",
          height: "15vh",
        }}
        className={`gameResult1 mt-5vh text-10vw flex justify-center items-center border-amber-900 ${myWin ? "text-white" : "text-white"}`}
      >
        {myWin ? "WIN" : "LOSE"}
      </div>
      {/*Middle*/}
      <div
        style={{
          background: `url(${MiddleBackground}) no-repeat`,
          backgroundPosition: "center center",
          backgroundSize: "80vw 53vh",
          width: "80vw",
          height: "53vh",
        }}
        className="gameResult2 mt-3vh flex flex-col items-center"
      >
        {resultState === "phase1" && myWin && (
          <div
            style={{
              background: `url(${ContinueBackground}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "80vw 25vh",
              width: "80vw",
              height: "25vh",
            }}
            className="gameResult3 flex flex-col justify-center items-center"
          >
            <div className="mt-3vh">상대에게 재도전 의사를 묻고 있습니다.</div>
            <div>잠시만 기다려 주십시오</div>
            {resultState !== "phase3" && (
              <div className="mt-1vh flex justify-center">
                <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
                  <div
                    className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        {resultState === "phase1" && !myWin && (
          <div
            style={{
              background: `url(${ContinueBackground}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "80vw 25vh",
              width: "80vw",
              height: "25vh",
            }}
            className="gameResult3 text-4vw flex flex-col justify-center items-center"
          >
            <div className="mt-2vh gameResult17">재도전 하시겠습니까?</div>
            {resultState !== "phase3" && (
              <div className="mt-1vh flex justify-center">
                <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
                  <div
                    className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
            <button
              className="gameResult19 mt-1vh text-4vw w-10vw h-3vh bg-amber-700 text-white font-bold rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
              onClick={() => sendRematch()}
            >
              네
            </button>
          </div>
        )}
        {resultState === "phase2" && myWin && (
          <div
            style={{
              background: `url(${ContinueBackground}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "80vw 25vh",
              width: "80vw",
              height: "25vh",
            }}
            className="gameResult3 flex flex-col justify-center items-center"
          >
            <div className="mt-1vh gameResult17">상대방이 재도전을 요청하였습니다</div>
            <div className="gameResult17">수락하시겠습니까?</div>
            {resultState !== "phase3" && (
              <div className="mt-1vh flex justify-center">
                <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
                  <div
                    className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
            <div>
              <button
                className="gameResult19 mt-1vh text-4vw w-10vw h-3vh bg-amber-700 text-white font-bold rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
                onClick={() => acceptRematch()}
              >
                네
              </button>
            </div>
          </div>
        )}
        {resultState === "phase2" && !myWin && (
          <div
            style={{
              background: `url(${ContinueBackground}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "80vw 25vh",
              width: "80vw",
              height: "25vh",
            }}
            className="gameResult3 flex flex-col justify-center items-center"
          >
            <div className="gameResult17">상대방의 재도전 수락여부를</div>
            <div className="gameResult17">기다리고 있습니다</div>
            {resultState !== "phase3" && (
              <div className="mt-1vh flex justify-center">
                <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
                  <div
                    className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        {resultState === "phase3" && (
          <div
            style={{
              background: `url(${ContinueBackground}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "80vw 25vh",
              width: "80vw",
              height: "25vh",
            }}
            className="gameResult3 flex flex-col justify-center items-center "
          >
            <Link
              to="/lobby"
              className="gameResult4 mt-1vh text-4vw w-35vw h-7vh flex justify-center items-center bg-amber-700 text-white rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
              onClick={() => leaveSession()}
            >
              로비로 가기
            </Link>
          </div>
        )}
        <div
          style={{
            background: `url(${RankPointBackground}) no-repeat`,
            backgroundPosition: "center center",
            backgroundSize: "75vw 40vh",
            width: "70vw",
            height: "35vh",
          }}
          className="gameResult5 flex flex-col"
        >
          <div className="ms-3vw self-center gameResult6">Rank</div>
          <div className="flex flex-col items-start ms-2vw space-y-2 w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-1/3 text-center py-2">순위</th>
                  <th className="w-1/3 text-center py-2">닉네임</th>
                  <th className="w-1/3 text-center py-2">점수</th>
                </tr>
              </thead>
              <tbody>
                {rankings &&
                  rankings.slice(0, 3).map((ranking, index) => (
                    <tr key={index}>
                      <td
                        className="text-center"
                        style={{
                          background: `url(${RankingTitle}) no-repeat center center`,
                          backgroundSize: "contain",
                          height: "3vh",
                        }}
                      >
                        {ranking.rank}
                      </td>
                      <td className="text-center py-1">{ranking.nickname}</td>
                      <td className="text-center py-1">{`${ranking.point}점`}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="gameResult12 h-8vh self-center ms-1vw text-7vw flex flex-wrap justify-center items-center text-red-600">
              내 점수 : {nowPoint}
              <span className="ms-1vw text-4vw gameResult13 text-black">
                {" "}
                {myWin
                  ? accessPoint == 0
                    ? ""
                    : ` + ${accessPoint}`
                  : accessPoint == 0
                    ? ""
                    : `${accessPoint}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/*Bottom*/}
      <div className="flex flex-col justify-center items-center ">
        <img
          className={`gameResult15 ${
            myWin
              ? "animate-bounce animate-infinite animate-duration-1000 animate-ease-linear"
              : "animate-fade-out"
          }`}
          src={sessionStorage.getItem("profile")}
          style={{ width: "28vw", height: "13vh" }}
        />
        <div
          style={{
            background: `url(${NicknameTitle}) no-repeat`,
            backgroundPosition: "center center",
            backgroundSize: "50vw 7vh",
            width: "50vw",
            height: "7vh",
          }}
          className="flex justify-center items-center gameResult16"
        >
          {sessionStorage.getItem("nickname")}
        </div>
      </div>
    </div>
  );
};

export default GameResult;
