import { useState, useEffect } from "react";
import Rodal from "rodal"; // Rodal import
import "rodal/lib/rodal.css"; // Rodal CSS
import LobbyBtn from "@/components/lobby/LobbyBtn";
import useShowComponent from "@/hooks/useShowComponent";
import usersApiCall from "@/api/axios/usersApiCall";
import background_modal from "@/assets/img/background_modal.png";
import ready_button from "@/assets/img/ready_button.png";
import { BGM, playBGM, createBGMInstance } from "../../utils/audioManager";

const SettingModal = ({ visible, onClose, bgm }) => {
  const [volume, setVolume] = useState(50); // 앱의 소리 조절 상태
  const [micVolume, setMicVolume] = useState(50); // 마이크 소리 조절 상태
  const isBtnVisible = useShowComponent();
  const useUsersApiCall = usersApiCall();

  useEffect(() => {
    if (bgm) {
      setVolume(Number(bgm.volume) * 100);
    }
  }, [bgm]);

  const logout = (event) => {
    event.preventDefault();
    useUsersApiCall.logout();
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    // bgm.volume = Number(event.target.value) / 100;
  };

  const handleMicVolumeChange = (event) => {
    setMicVolume(event.target.value);
  };

  return (
    <Rodal
      visible={visible}
      onClose={onClose}
      closeOnEsc={true}
      closeMaskOnClick={false}
      height={320}
      customStyles={{
        padding: 10,
        overflow: "auto",
        width: "80%",
        backgroundImage: `url(${background_modal})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundColor: "transparent", // 배경색 투명으로 설정
        borderRadius: "none", // border-radius 제거
        boxShadow: "none", // box-shadow 제거
      }}
      className="settingModal"
    >
      <div className="flex flex-col items-center p-5  text-black rounded-lg">
        <h1 className="mb-4 text-2xl font-bold">설정</h1>
        <div className="w-full mb-4">
          <label className=" block mb-2">앱 소리 조절: </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-blue-500 rounded"
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-2">마이크 소리 조절: </label>
          <input
            type="range"
            min="0"
            max="100"
            value={micVolume}
            onChange={handleMicVolumeChange}
            className="w-full h-2 bg-blue-500 rounded"
          />
        </div>
        {/* <div className="flex items-center">
          <label className="mr-2">초대 차단: </label>
          <button
            onClick={handleBlockInvitesChange}
            className={`w-10 h-6 rounded-full ${blockInvites ? "bg-green-500" : "bg-red-500"}`}
          ></button>
        </div> */}
        <div>
          {!isBtnVisible.value && (
            <LobbyBtn
              text="로그아웃"
              style={{
                backgroundImage: `url(${ready_button})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
              }}
              onClick={logout}
            />
          )}
        </div>
        <div></div>
      </div>
    </Rodal>
  );
};

export default SettingModal;
