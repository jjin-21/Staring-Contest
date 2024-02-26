import React, { useState } from "react";
import MyFriends from "@/components/lobby/MyFriends";
import FriendsRequest from "@/components/lobby/FriendsRequest";
import FriendsSearch from "@/components/lobby/FriendsSearch";

const FriendManagement = () => {
  const [activeComponent, setActiveComponent] = useState("MyFriends");

  const showComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "MyFriends":
        return <MyFriends visible={activeComponent === "MyFriends"} />;
      case "FriendsRequest":
        return <FriendsRequest visible={activeComponent === "FriendsRequest"} />;
      case "FriendsSearch":
        return <FriendsSearch />;
      default:
        return <MyFriends visible={activeComponent === "MyFriends"} />;
    }
  };

  return (
    <>
      <button
        onClick={() => showComponent("MyFriends")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        내 친구
      </button>
      <button
        onClick={() => showComponent("FriendsRequest")}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-2 rounded"
      >
        친구 요청
      </button>
      <button
        onClick={() => showComponent("FriendsSearch")}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded"
      >
        친구 찾기
      </button>
      {renderComponent()}
    </>
  );
};

export default FriendManagement;
