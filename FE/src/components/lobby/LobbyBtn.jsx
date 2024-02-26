import React from "react";

const LobbyBtn = ({ text, style, onClick, className }) => {
  return (
    <button onClick={onClick} style={style} className={`${className}`}>
      {text}
    </button>
  );
};

export default LobbyBtn;
