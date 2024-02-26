import React, { useState } from "react";
import Profile from "@/components/lobby/Profile";
import PasswordChange from "@/components/lobby/PasswordChange";
import DeleteUser from "@/components/lobby/DeleteUser";
import FriendsManagement from "@/components/lobby/FriendsManagement";

const MyInfo = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderComponent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "friends":
        return <FriendsManagement />;
      case "changeInfo":
        return <PasswordChange />;
      case "deleteUser":
        return <DeleteUser />;
      default:
        return <Profile />;
    }
  };

  return (
    <div
      className="p-4 bg-white shadow-lg rounded-lg animate-fade-down animate-once"
      visible={visible}
    >
      <div className="flex justify-between mb-4">
        <button
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          onClick={() => setActiveTab("profile")}
        >
          프로필
        </button>
        <button
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          onClick={() => setActiveTab("friends")}
        >
          친구 관리
        </button>
        <button
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          onClick={() => setActiveTab("changeInfo")}
        >
          비밀번호 변경
        </button>
        <button
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          onClick={() => setActiveTab("deleteUser")}
        >
          회원 탈퇴
        </button>
      </div>
      <div className="mb-4">{renderComponent()}</div>
      <button
        className="w-full border border-gray-300 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
};

export default MyInfo;
