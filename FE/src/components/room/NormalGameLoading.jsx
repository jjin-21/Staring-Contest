import TitleBar from "@/assets/img/matchingInfo/TitleBar.png";
import LoginTemplate4 from "@/assets/img/matchingInfo/LoginTemplate4.png";
import NicknameTitle from "@/assets/img/matchingInfo/NicknameTitle.png";
import VSImage from "@/assets/img/matchingInfo/VSImage.png";
import CountdownBackground from "@/assets/img/matchingInfo/CountdownBackground.png";
import { useState, useEffect } from "react";

const NormalGameLoading = ({ gameType, publisher, subscribers, teamA, teamB }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  return (
    <>
      <div className="boxControl" style={{ backgroundColor: "#69492E", height: "100%vh" }}>
        <div className="flex flex-col h-100vh matchingInfo6 relative">
          <div className="text-10vw mt-3vh font-bold text-center matchingInfo0">
            <div className="text-5xl font-bold mb-5 text-center">
              {gameType === "classic" ? "클래식전" : "아이템전"}
              <hr className="mt-2vh border-black" />
            </div>
          </div>
          <div className="flex flex-col absolute" style={{ top: "13%", left: "10%" }}>
            <div
              style={{
                background: `url(${TitleBar}) no-repeat`,
                backgroundSize: "cover",
                width: "50%",
              }}
              className="h-7vh mt-1vh text-6vw flex justify-center items-center self-center border-2 matchingInfo2"
            >
              A팀 출전순서
            </div>
            <div className="mt-3vh flex flex-col items-center gap-3">
              {teamA.map((streamId, idx) => {
                const streamManager =
                  streamId === publisher?.stream.streamId
                    ? publisher
                    : subscribers.find((sub) => sub.stream.streamId === streamId);
                return streamManager ? (
                  <div key={idx} className="flex justify-evenly w-80vw">
                    <div className="flex justify-center items-center text-6vw">{idx + 1}</div>
                    <img
                      src={JSON.parse(streamManager.stream.connection.data).clientProfile}
                      style={{
                        background: `url(${LoginTemplate4}) no-repeat`,
                        backgroundSize: "10vw 5vh",
                        backgroundPosition: "center",
                        width: "10vw",
                        height: "5vh",
                      }}
                      className="flex flex-col self-center matchingInfo1"
                    />
                    <div
                      style={{
                        background: `url(${NicknameTitle}) no-repeat`,
                        backgroundSize: "40vw 5vh",
                        backgroundPosition: "center",
                        width: "40vw",
                        height: "5vh",
                      }}
                      className="flex justify-center items-center self-center matchingInfo1"
                    >
                      {JSON.parse(streamManager.stream.connection.data).clientData}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div
            className="flex items-center ms-12vh matchingInfo7-1 mt-3vh mb-2vh absolute"
            style={{ top: "45%", left: "-5%" }}
          >
            <img src={VSImage} style={{ width: "30vw", height: "7vh" }} className="matchingInfo7" />
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

          <div className="flex flex-col absolute" style={{ top: "60%", left: "10%" }}>
            <div
              style={{
                background: `url(${TitleBar}) no-repeat`,
                backgroundSize: "cover",
                width: "50%",
              }}
              className="h-7vh text-6vw flex justify-center items-center self-center border-2 matchingInfo2"
            >
              B팀 출전순서
            </div>
            <div className="mt-3vh flex flex-col items-center gap-3">
              {teamB.map((streamId, idx) => {
                const streamManager =
                  streamId === publisher?.stream.streamId
                    ? publisher
                    : subscribers.find((sub) => sub.stream.streamId === streamId);
                return streamManager ? (
                  <div key={idx} className="flex justify-evenly w-80vw">
                    <div className="flex justify-center items-center text-6vw">{idx + 1}</div>
                    <img
                      src={JSON.parse(streamManager.stream.connection.data).clientProfile}
                      style={{
                        background: `url(${LoginTemplate4}) no-repeat`,
                        backgroundSize: "10vw 5vh",
                        backgroundPosition: "center",
                        width: "10vw",
                        height: "5vh",
                      }}
                      className="flex flex-col self-center matchingInfo1"
                    />
                    <div
                      style={{
                        background: `url(${NicknameTitle}) no-repeat`,
                        backgroundSize: "40vw 5vh",
                        backgroundPosition: "center",
                        width: "40vw",
                        height: "5vh",
                      }}
                      className="flex justify-center items-center self-center matchingInfo1"
                    >
                      {JSON.parse(streamManager.stream.connection.data).clientData}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NormalGameLoading;
