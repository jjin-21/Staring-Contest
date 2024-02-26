// import profile from "../assets/img/bird_weard_pirate-hat.png"; // 프로필 사진 파일 경로
import NavBar from "@/components/lobby/NavBar";
import post_it_1 from "../assets/img/post_it_1.png";
import post_it_2 from "../assets/img/post_it_2.png";
import wooden_board from "@/assets/img/wooden_board.png";
import subject_board from "@/assets/img/subject_board.png";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useEffect, useState } from "react";
import { toast, Slide, Bounce } from "react-toastify";
import { BGM, playBGM, createBGMInstance } from "../utils/audioManager";

const RankingGameChoice = () => {
  const { client, match, gameId, setMatch, opponentInfo } = useWebSocket();
  const [gameType, setGameType] = useState("");
  const [point, setPoint] = useState("");
  const [matching, setMatching] = useState(false);

  const navigate = useNavigate();
  const classicPoint = sessionStorage.getItem("classicPt");
  const itemPoint = sessionStorage.getItem("itemPt");
  const email = sessionStorage.getItem("email");
  const [bgm, setBgm] = useState(null);

  useEffect(() => {
    if (bgm) {
      return () => {
        bgm.pause();
        bgm.src = "";
      };
    }
  });

  useEffect(() => {
    if (match && gameId) {
      // setMatch(false);
      // navigate(`/game/${gameId}`, { state: { gameType, opponentInfo } });
      toast.dismiss(); // Pending 알림이 있다면 닫기
      toast.success("매칭에 성공하였습니다", {
        autoClose: 2000, // 2초 동안 표시
        onClose: () => {
          // 알림이 닫힌 후 실행할 로직
          setMatch(false); // 매칭 상태 초기화
          navigate(`/game/${gameId}`, { state: { gameType, opponentInfo } }); // 페이지 이동
        },
      });
    }
  }, [match, gameId]);

  const startMatch = (isItem) => {
    toast.info("매칭 찾는 중...", { autoClose: false, position: "top-center", theme: "colored" });
    setMatching(true);
    if (client) {
      client.publish({
        destination: "/stomp/matching",
        body: JSON.stringify({
          // Your JSON data here
          ifItem: isItem,
          email: email,
          point: isItem ? itemPoint : classicPoint,
        }),
      });
    } else {
    }
  };

  const cancelMatch = (isItem) => {
    toast.dismiss();
    setMatching(false);
    if (client) {
      client.publish({
        destination: "/stomp/stomp/matching-cancel",
        body: JSON.stringify({
          ifItem: isItem,
          email: email,
          point: isItem ? itemPoint : classicPoint,
        }),
      });
    } else {
    }
  };

  const handleClassicClick = () => {
    // 클래식 버튼 클릭 시 수행하는 함수를 여기에 작성하세요.
    if (!matching) {
      setGameType("classic");
      setBgm(createBGMInstance(BGM.MATCHING));
      startMatch(false);
    } else {
      setGameType("");
      if (bgm) {
        bgm.pause();
        bgm.src = "";
      }
      cancelMatch(false);
    }
  };

  const handleItemClick = () => {
    // 아이템 버튼 클릭 시 수행하는 함수를 여기에 작성하세요.
    if (!matching) {
      setGameType("item");
      setBgm(createBGMInstance(BGM.MATCHING));
      startMatch(true);
    } else {
      setGameType("");
      if (bgm) {
        bgm.pause();
        bgm.src = "";
      }
      cancelMatch(true);
    }
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="h-screen flex flex-col items-center space-y-2 animate-fade-left animate-once">
        <div></div>
        <div
          className="flex justify-center items-center "
          style={{
            position: "relative",
            height: "15%",
            width: "70%",
            backgroundImage: `url(${subject_board})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        >
          {/* <img src={subject_board} /> */}
          <div
            className="object-cover absolute text-stone-100 h-auto font-bold tracking-wide w-full text-center"
            style={{
              fontSize: "300%",
              position: "absolute",
              // left: "50%",
              // transform: "translate(-30%,-50%)",
              // top: "50%",

              textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
              letterSpacing: "10px", // 글자 사이의 간격을 2px로 지정
            }}
          >
            랭킹전
          </div>
        </div>
        <div className="flex-col" style={{ position: "relative", height: "60%" }}>
          <img src={wooden_board} />
          <div
            className="object-cover absolute z-0 w-4/5 h-4/5"
            style={{
              transform: "translateX(-50%)",
              left: "50%",
              top: "5%",
            }}
          >
            <div
              className="active:animate-rotate-x active:animate-duration-500"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button onClick={handleClassicClick} style={{ position: "relative" }}>
                <img src={post_it_1} />
                <div
                  className="font-bold w-full"
                  style={{
                    fontSize: "200%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
                  }}
                >
                  {matching && gameType === "classic" ? "매칭 취소" : "클래식전"}
                </div>
              </button>
            </div>
            <div
              className="active:animate-rotate-x active:animate-duration-500"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button onClick={handleItemClick} style={{ position: "relative" }}>
                <img src={post_it_2} />
                <div
                  className="font-bold w-full "
                  style={{
                    fontSize: "200%",
                    position: "absolute",

                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
                  }}
                >
                  {matching && gameType === "item" ? "매칭 취소" : "아이템전"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 랭킹전, 일반전 버튼 */}
    </>
  );
};

export default RankingGameChoice;
