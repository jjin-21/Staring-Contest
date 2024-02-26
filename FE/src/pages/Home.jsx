import React from "react";
import LobbyBtn from "@/components/lobby/LobbyBtn";
import SignupFormModal from "@/components/modal/SignupFormModal";
import LoginFormModal from "@/components/modal/LoginFormModal";
import DescriptionModal from "@/components/modal/DescriptionModal";
import useShowRodal from "@/hooks/useShowRodal";
import mainbirds from "@/assets/img/mainbirds.png";
import question_mark from "@/assets/img/question_mark.png";
import logo from "../assets/img/logo.png";
import btn_main from "../assets/img/btn_main.png";
import background_home2 from "../assets/img/background_home2.png";

const Home = () => {
  const isSignupModalVisible = useShowRodal();
  const isLoginModalVisible = useShowRodal();
  const isDescriptionModalVisible = useShowRodal();

  return (
    <div
      className="flex flex-col justify-center h-screen items-center"
      style={{
        backgroundImage: `url(${background_home2})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="space-y-2">
        <img src={logo} />
      </div>
      <img src={mainbirds} />
      <div className="w-full flex justify-end items-center px-4">
        <button onClick={isDescriptionModalVisible.showRodal}>
          <img src={question_mark} />
        </button>
      </div>
      {/* <LobbyBtn text="로그인" onClick={isLoginModalVisible.showRodal} /> */}
      {/* <LobbyBtn text="회원가입" onClick={isSignupModalVisible.showRodal} /> */}
      <div className="flex justify-center items-center">
        <button onClick={isLoginModalVisible.showRodal} style={{ position: "relative" }}>
          <img src={btn_main} />
          <div
            className="font-bold"
            style={{
              fontSize: "180%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
            }}
          >
            로그인
          </div>
        </button>
      </div>
      <div className="flex mt-10">
        <button onClick={isSignupModalVisible.showRodal} style={{ position: "relative" }}>
          <img src={btn_main} />
          <div
            className="font-bold"
            style={{
              fontSize: "180%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
            }}
          >
            회원가입
          </div>
        </button>
      </div>
      <SignupFormModal
        visible={isSignupModalVisible.value}
        onClose={isSignupModalVisible.hideRodal}
      />
      <LoginFormModal visible={isLoginModalVisible.value} onClose={isLoginModalVisible.hideRodal} />
      <DescriptionModal
        visible={isDescriptionModalVisible.value}
        onClose={isDescriptionModalVisible.hideRodal}
      />
    </div>
  );
};

export default Home;
