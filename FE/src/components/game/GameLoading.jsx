import background_wooden_plate from "../../assets/img/background_wooden_plate.png";
import TitleBar from "@/assets/img/matchingInfo/TitleBar.png";
import InfoBackground3 from "@/assets/img/matchingInfo/InfoBackground3.png";
import VSImage from "@/assets/img/matchingInfo/VSImage.png";
import CountdownBackground from "@/assets/img/matchingInfo/CountdownBackground.png";
import { useState, useEffect } from "react";
import changeProfileImage from "@/utils/changeProfileImage";

const GameLoading = ({ publisher, subscriber, gameType, opponentInfoParsed }) => {
  const [countdown, setCountdown] = useState(5);

  const myNickName = sessionStorage.getItem("nickname");
  const myProfileImage = sessionStorage.getItem("profile");
  const opponentNickname = opponentInfoParsed.nickname;
  const myClassicPoint = sessionStorage.getItem("classicPt");
  const opponentClassicPoint = opponentInfoParsed.classicPt;
  const myWinNumClassic = sessionStorage.getItem("winNumClassic");
  const opponentWinNumClassic = opponentInfoParsed.winNumClassic;
  const myLoseNumClassic = sessionStorage.getItem("loseNumClassic");
  const opponentLoseNumClassic = opponentInfoParsed.loseNumClassic;
  const myItemPoint = sessionStorage.getItem("itemPt");
  const opponentItemPoint = opponentInfoParsed.itemPt;
  const myWinNumItem = sessionStorage.getItem("winNumItem");
  const opponentWinNumItem = opponentInfoParsed.winNumItem;
  const myLoseNumItem = sessionStorage.getItem("loseNumItem");
  const opponentLoseNumItem = opponentInfoParsed.loseNumItem;
  const expectedWinPt = opponentInfoParsed.expectedWinPt;
  const expectedLosePt = opponentInfoParsed.expectedLosePt;

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  return (
    <div className="boxControl" style={{ backgroundColor: "#69492E", height: "100%vh" }}>
      <div className="flex flex-col h-100vh matchingInfo6">
        <div className="text-10vw font-bold text-center mt-5vh matchingInfo0">
          {gameType === "classic" ? "클래식전" : "아이템전"}
          <hr className="mt-1vh border-black" />
        </div>
        <div
          style={{
            background: `url(${InfoBackground3}) no-repeat`,
            backgroundSize: "90vw 90vh",
            backgroundPosition: "center",
            width: "90vw",
            height: "90vh",
          }}
          className="mt-2vh flex flex-col self-center matchingInfo1"
        >
          <div
            style={{
              background: `url(${TitleBar}) no-repeat`,
              backgroundSize: "cover",
            }}
            className="mt-10vh w-50vw h-7vh flex items-center self-center border-2 matchingInfo2"
          >
            <img
              src={sessionStorage.getItem("profile")}
              style={{ width: "8vw", height: "5vh" }}
              className="ms-5vw matchingInfo3"
            />
            <div className="flex justify-center matchingInfo4 ms-2vw w-30vw text-5vw">
              {myNickName}
            </div>
          </div>
          <div className="matchingInfo5-0">
            <div className="text-5vw mt-2vh ml-16vw matchingInfo5">
              {gameType === "classic" ? "1. 점수(Classic) :" : "1. 점수(Item) :"}
              <span className="ml-3vw text-gray-300 matchingInfo10">
                {gameType === "classic" ? myClassicPoint : myItemPoint} 점
              </span>
            </div>
            <div className="text-5vw mt-1vh ml-16vw matchingInfo5">
              2. 전적 :
              <span className="ml-3vw text-gray-300 matchingInfo10">
                {gameType === "classic" ? myWinNumClassic : myWinNumItem}승{" "}
                {gameType === "classic" ? myLoseNumClassic : myLoseNumItem}패
              </span>
            </div>
            <div className="text-5vw mt-1vh ml-16vw matchingInfo5">
              <div>
                ㆍ승리시 :
                <span className="ml-3vw text-6vw text-[#7ce772] matchingInfo10">
                  +{expectedWinPt} 점
                </span>
              </div>
              <div>
                ㆍ패배시 :
                <span className="ml-3vw text-6vw text-[#ebbcbc] matchingInfo10">
                  {expectedLosePt} 점
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center ms-12vh matchingInfo7-1 mt-3vh mb-2vh">
            <img src={VSImage} style={{ width: "20vw", height: "7vh" }} className="matchingInfo7" />
            <div
              style={{
                background: `url(${CountdownBackground}) no-repeat center center`,
                backgroundSize: "20vw 8vh",
                width: "20vw",
                height: "8vh",
              }}
              className="ms-10vw blink flex justify-center items-center text-8vw text-[#f3f3f3] matchingInfo8"
            >
              {countdown} 초
            </div>
          </div>
          <div
            style={{
              background: `url(${TitleBar}) no-repeat`,
              backgroundSize: "cover",
            }}
            className="mt-2vh w-50vw h-7vh flex items-center self-center border-amber-500 border-4 matchingInfo9"
          >
            <img
              src={changeProfileImage().profileImagePath(opponentInfoParsed.profileImage)}
              style={{ width: "8vw", height: "5vh" }}
              className="ms-5vw matchingInfo3"
            />
            <div className="flex justify-center matchingInfo4 ms-2vw w-30vw text-5vw text-amber-500">
              {opponentNickname}
            </div>
          </div>
          <div className="matchingInfo5-1">
            <div className="text-5vw mt-2vh ml-16vw matchingInfo5">
              {gameType === "classic" ? "1. 점수(Classic) :" : "1. 점수(Item) :"}
              <span className="ml-3vw text-amber-500 matchingInfo10">
                {gameType === "classic" ? opponentClassicPoint : opponentItemPoint} 점
              </span>
            </div>

            <div className="text-5vw mt-1vh ml-16vw matchingInfo5">
              2. 전적 :
              <span className="ml-3vw text-amber-500 matchingInfo10">
                {gameType === "classic" ? opponentWinNumClassic : opponentWinNumItem}승{" "}
                {gameType === "classic" ? opponentLoseNumClassic : opponentLoseNumItem}패
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoading;
