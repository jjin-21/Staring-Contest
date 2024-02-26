import { useEffect } from "react";
import TitleBar from "@/assets/img/gameResult/TitleBar.png";
import MiddleBackground from "@/assets/img/gameResult/MiddleBackground.png";
import ContinueBackground from "@/assets/img/gameResult/ContinueBackground.png";
import RankPointBackground from "@/assets/img/gameResult/RankPointBackground.png";
import NicknameTitle from "@/assets/img/gameResult/NicknameTitle.png";
import RankingTitle from "@/assets/img/gameResult/RankingTitle.png";
import { SFX, playSFX } from "../../utils/audioManager";

const NormalGameResult = ({
  winTeam,
  myTeam,
  teamA,
  teamB,
  setGameState,
  setWinTeam,
  sendReady,
}) => {
  useEffect(() => {
    if (winTeam) {
      sendReady();
    }
  }, [winTeam]);

  useEffect(() => {
    if (winTeam === "D") {
      playSFX(SFX.DRAW);
    } else if (winTeam === myTeam) {
      playSFX(SFX.WIN);
    } else if (winTeam !== myTeam) {
      playSFX(SFX.LOSE);
    }
  }, [winTeam]);

  return (
    // <div
    //   className="boxControl flex flex-col items-center animate-fade-left animate-once"
    //   style={{ backgroundColor: "#69492E", height: "100vh" }}
    // >
    //   {/*Top*/}
    //   <div
    //     style={{
    //       background: `url(${TitleBar}) no-repeat`,
    //       backgroundPosition: "center center",
    //       backgroundSize: "50vw 15vh",
    //       width: "50vw",
    //       height: "15vh",
    //     }}
    //     className={`gameResult1 mt-5vh text-10vw flex justify-center items-center border-amber-900 ${myWin ? "text-white" : "text-white"}`}
    //   >
    //     {myWin ? "WIN" : "LOSE"}
    //   </div>
    //   {/*Middle*/}
    //   <div
    //     style={{
    //       background: `url(${MiddleBackground}) no-repeat`,
    //       backgroundPosition: "center center",
    //       backgroundSize: "80vw 53vh",
    //       width: "80vw",
    //       height: "53vh",
    //     }}
    //     className="gameResult2 mt-3vh flex flex-col items-center"
    //   >
    //     {resultState === "phase1" && myWin && (
    //       <div
    //         style={{
    //           background: `url(${ContinueBackground}) no-repeat`,
    //           backgroundPosition: "center center",
    //           backgroundSize: "80vw 25vh",
    //           width: "80vw",
    //           height: "25vh",
    //         }}
    //         className="gameResult3 flex flex-col justify-center items-center"
    //       >
    //         <div className="mt-3vh">상대에게 재도전 의사를 묻고 있습니다.</div>
    //         <div>잠시만 기다려 주십시오</div>
    //         {resultState !== "phase3" && (
    //           <div className="mt-1vh flex justify-center">
    //             <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
    //               <div
    //                 className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
    //                 style={{
    //                   width: `${progress}%`,
    //                 }}
    //               ></div>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     )}
    //     {resultState === "phase1" && !myWin && (
    //       <div
    //         style={{
    //           background: `url(${ContinueBackground}) no-repeat`,
    //           backgroundPosition: "center center",
    //           backgroundSize: "80vw 25vh",
    //           width: "80vw",
    //           height: "25vh",
    //         }}
    //         className="gameResult3 text-4vw flex flex-col justify-center items-center"
    //       >
    //         <div className="mt-2vh gameResult17">재도전 하시겠습니까?</div>
    //         {resultState !== "phase3" && (
    //           <div className="mt-1vh flex justify-center">
    //             <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
    //               <div
    //                 className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
    //                 style={{
    //                   width: `${progress}%`,
    //                 }}
    //               ></div>
    //             </div>
    //           </div>
    //         )}
    //         <button
    //           className="gameResult19 mt-1vh text-4vw w-10vw h-3vh bg-amber-700 text-white font-bold rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
    //           onClick={() => sendRematch()}
    //         >
    //           네
    //         </button>
    //       </div>
    //     )}
    //     {resultState === "phase2" && myWin && (
    //       <div
    //         style={{
    //           background: `url(${ContinueBackground}) no-repeat`,
    //           backgroundPosition: "center center",
    //           backgroundSize: "80vw 25vh",
    //           width: "80vw",
    //           height: "25vh",
    //         }}
    //         className="gameResult3 flex flex-col justify-center items-center"
    //       >
    //         <div className="mt-1vh gameResult17">상대방이 재도전을 요청하였습니다</div>
    //         <div className="gameResult17">수락하시겠습니까?</div>
    //         {resultState !== "phase3" && (
    //           <div className="mt-1vh flex justify-center">
    //             <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
    //               <div
    //                 className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
    //                 style={{
    //                   width: `${progress}%`,
    //                 }}
    //               ></div>
    //             </div>
    //           </div>
    //         )}
    //         <div>
    //           <button
    //             className="gameResult19 mt-1vh text-4vw w-10vw h-3vh bg-amber-700 text-white font-bold rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
    //             onClick={() => acceptRematch()}
    //           >
    //             네
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //     {resultState === "phase2" && !myWin && (
    //       <div
    //         style={{
    //           background: `url(${ContinueBackground}) no-repeat`,
    //           backgroundPosition: "center center",
    //           backgroundSize: "80vw 25vh",
    //           width: "80vw",
    //           height: "25vh",
    //         }}
    //         className="gameResult3 flex flex-col justify-center items-center"
    //       >
    //         <div className="gameResult17">상대방의 재도전 수락여부를</div>
    //         <div className="gameResult17">기다리고 있습니다</div>
    //         {resultState !== "phase3" && (
    //           <div className="mt-1vh flex justify-center">
    //             <div className="gameResult18 w-40vw bg-gray-300 h-3vh rounded-full shadow">
    //               <div
    //                 className="bg-amber-800 h-full rounded-full transition-all ease-in-out"
    //                 style={{
    //                   width: `${progress}%`,
    //                 }}
    //               ></div>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     )}
    //     {resultState === "phase3" && (
    //       <div
    //         style={{
    //           background: `url(${ContinueBackground}) no-repeat`,
    //           backgroundPosition: "center center",
    //           backgroundSize: "80vw 25vh",
    //           width: "80vw",
    //           height: "25vh",
    //         }}
    //         className="gameResult3 flex flex-col justify-center items-center "
    //       >
    //         <Link
    //           to="/lobby"
    //           className="gameResult4 mt-1vh text-4vw w-35vw h-7vh flex justify-center items-center bg-amber-700 text-white rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
    //           onClick={() => leaveSession()}
    //         >
    //           로비로 가기
    //         </Link>
    //       </div>
    //     )}
    //     <div
    //       style={{
    //         background: `url(${RankPointBackground}) no-repeat`,
    //         backgroundPosition: "center center",
    //         backgroundSize: "75vw 30vh",
    //         width: "70vw",
    //         height: "25vh",
    //       }}
    //       className="gameResult5 flex flex-col"
    //     >
    //       <div className="ms-3vw self-center gameResult6">Rank</div>
    //       <div className="flex gameResult7">
    //         <div className="flex flex-col items-start ms-2vw space-y-2vh">
    //           <div className="flex justify-center items-center mt-2vh">
    //             <div
    //               className="ms-1vw flex justify-center items-center gameResult8"
    //               style={{
    //                 background: `url(${RankingTitle}) no-repeat`,
    //                 backgroundPosition: "0.5vw center",
    //                 backgroundSize: "5vw 3vh",
    //                 width: "5vw",
    //                 height: "3vh",
    //               }}
    //             >
    //               {rankings ? `${rankings[0].rank}` : ""}
    //             </div>
    //             <div className="ms-1vw gameResult11">
    //               {rankings ? `${rankings[0].nickname} - ${rankings[0].point}점` : ""}
    //             </div>
    //           </div>
    //           <div className="flex justify-center items-center">
    //             <div
    //               className="ms-2vw flex justify-center items-center gameResult9"
    //               style={{
    //                 background: `url(${RankingTitle}) no-repeat`,
    //                 backgroundPosition: "0.5vw center",
    //                 backgroundSize: "5vw 3vh",
    //                 width: "5vw",
    //                 height: "3vh",
    //               }}
    //             >
    //               {rankings ? `${rankings[1].rank}` : ""}
    //             </div>
    //             <div className="ms-1vw gameResult11">
    //               {rankings ? `${rankings[1].nickname} - ${rankings[1].point}점` : ""}
    //             </div>
    //           </div>
    //           <div className="flex justify-center items-center">
    //             <div
    //               className="ms-3vw flex justify-center items-center gameResult10"
    //               style={{
    //                 background: `url(${RankingTitle}) no-repeat`,
    //                 backgroundPosition: "0.5vw center",
    //                 backgroundSize: "5vw 3vh",
    //                 width: "5vw",
    //                 height: "3vh",
    //               }}
    //             >
    //               {rankings ? `${rankings[2]?.rank}` : ""}
    //             </div>
    //             <div className="ms-1vw gameResult11">
    //               {rankings ? `${rankings[2]?.nickname} - ${rankings[2]?.point}점` : ""}
    //             </div>
    //           </div>
    //         </div>

    //         <div className="gameResult14 mt-3vh ms-10vw flex flex-col justify-center items-center">
    //           <div className="gameResult12 ms-1vw text-7vw flex flex-wrap justify-center items-center text-red-600">
    //             {nowPoint}
    //           </div>

    //           <div className="ms-10vw gameResult13">
    //             {" "}
    //             {myWin ? `+ ${accessPoint}` : `${accessPoint}`}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/*Bottom*/}
    //   <div className="flex flex-col justify-center items-center ">
    //     <img
    //       className="gameResult15"
    //       src={sessionStorage.getItem("profile")}
    //       style={{ width: "20vw", height: "13vh" }}
    //     />
    //     <div
    //       style={{
    //         background: `url(${NicknameTitle}) no-repeat`,
    //         backgroundPosition: "center center",
    //         backgroundSize: "50vw 7vh",
    //         width: "50vw",
    //         height: "7vh",
    //       }}
    //       className="flex justify-center items-center gameResult16"
    //     >
    //       {sessionStorage.getItem("nickname")}
    //     </div>
    //   </div>
    // </div>

    <div
      className="boxControl flex flex-col items-center animate-fade-left animate-once"
      style={{ backgroundColor: "#69492E", height: "100vh" }}
    >
      <div
        style={{
          background: `url(${TitleBar}) no-repeat`,
          backgroundPosition: "center center",
          backgroundSize: "50vw 15vh",
          width: "50vw",
          height: "15vh",
        }}
        className={`gameResult1 mt-5vh text-10vw flex justify-center items-center border-amber-900`}
      >
        {winTeam === "D" ? (
          <div>무승부</div>
        ) : winTeam === myTeam ? (
          <div>{myTeam}팀 승리</div>
        ) : (
          <div>{myTeam}팀 패배</div>
        )}
      </div>
      <div
        style={{
          background: `url(${MiddleBackground}) no-repeat`,
          backgroundPosition: "center center",
          backgroundSize: "80vw 70vh",
          width: "80vw",
          height: "70vh",
        }}
        className="gameResult2 mt-3vh flex flex-col justify-between items-center"
      >
        <div
          style={{
            background: `url(${ContinueBackground}) no-repeat`,
            backgroundPosition: "center center",
            backgroundSize: "contain",
            width: "100%",
            height: "40%",
          }}
          className="gameResult3 flex flex-col justify-center items-center mt-2vh"
        >
          <button
            className="gameResult4 mt-1vh text-5vw w-40vw h-10vh flex justify-center items-center bg-amber-700 text-white rounded hover:bg-amber-800 focus:outline-none focus:shadow-outline"
            onClick={() => {
              setGameState("waitingRoom");
              setWinTeam("");
            }}
          >
            대기방으로 나가기
          </button>
        </div>
        <div
          className="flex flex-col justify-center items-center"
          style={{
            width: "100%",
            height: "60%",
          }}
        >
          <img
            className={`gameResult15 ${
              winTeam === "D"
                ? "animate-wiggle animate-infinite animate-duration-[2000ms] animate-ease-linear"
                : winTeam === myTeam
                  ? "animate-bounce animate-infinite animate-duration-1000 animate-ease-linear"
                  : "animate-fade-out"
            }`}
            src={sessionStorage.getItem("profile")}
            style={{ width: "60%", height: "50%" }}
          />
          <div
            style={{
              background: `url(${NicknameTitle}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              width: "100%",
              height: "20%",
            }}
            className="flex justify-center items-center gameResult16 "
          >
            {sessionStorage.getItem("nickname")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalGameResult;
