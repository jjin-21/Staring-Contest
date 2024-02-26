import NotificationModal from "../modal/NotificationModal.jsx";
import NotificationIcon from "../../assets/img/notificationicon.png";
import MessageModal from "../../components/modal/MessageModal.jsx";
import MessageIcon from "../../assets/img/messageicon.png";
import SettingModal from "../modal/SettingModal"; // SettingRodal import
import SettingIcon from "../../assets/img/settingicon.png";
import BackMark from "../../assets/img/back_mark.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SFX, playSFX } from "../../utils/audioManager";

const NavBar = ({ bgm }) => {
  const [settingsVisible, setSettingsVisible] = useState(false); // 설정 모달 가시성 state
  const [notificationVisible, setNotificationVisible] = useState(false); // 알림 모달 가시성 state
  const [messageVisible, setMessageVisible] = useState(false);
  const navigate = useNavigate();

  const handleMessageOpen = () => {
    setMessageVisible(true); // 설정 모달 열기
  };

  const handleMessageClose = () => {
    setMessageVisible(false); // 설정 모달 닫기
  };

  const handleNotificationOpen = () => {
    setNotificationVisible(true); // 알림 모달 열기
  };

  const handleNotificationClose = () => {
    setNotificationVisible(false); // 알림 모달 닫기
  };

  const handleSettingsOpen = () => {
    playSFX(SFX.POPUP);
    setSettingsVisible(true); // 설정 모달 열기
  };

  const handleSettingsClose = () => {
    playSFX(SFX.POPUP);
    setSettingsVisible(false); // 설정 모달 닫기
  };

  const handleBackButtonClick = () => {
    playSFX(SFX.CLICK);
    navigate(-1);
  };

  return (
    <div className="text-center">
      <div></div>
      {/* 알림, 설정 버튼 */}
      <div className="flex justify-between gap-4 p-4">
        <button onClick={handleBackButtonClick}>
          <img src={BackMark} />
        </button>
        <div className="flex gap-4">
          {/* <button onClick={handleMessageOpen}>
            <img src={MessageIcon} />
          </button> */}
          {/* <button onClick={handleNotificationOpen}>
            <img src={NotificationIcon} />
          </button> */}
          <button onClick={handleSettingsOpen}>
            <img src={SettingIcon} />
          </button>
        </div>
      </div>
      {/* 메시지 모달 */}
      {/* <MessageModal visible={messageVisible} onClose={handleMessageClose} /> */}
      {/* 알림 모달 */}
      {/* <NotificationModal visible={notificationVisible} onClose={handleNotificationClose} /> */}
      {/* 설정 모달 */}
      <SettingModal visible={settingsVisible} onClose={handleSettingsClose} bgm={bgm} />
    </div>
  );
};

export default NavBar;
