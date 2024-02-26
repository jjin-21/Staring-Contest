import { createContext, useContext, useState, useMemo, useEffect } from "react";
import changeProfileImage from "@/utils/changeProfileImage";

export const AccessTokenContext = createContext({
  accessToken: "",
  refreshToken: "",
  email: "",
  nickname: "",
  profile: "",
  profileImageIndex: 0,
  classicPt: 0,
  itemPt: 0,
  winNumItem: 0,
  loseNumItem: 0,
  winNumClassic: 0,
  loseNumClassic: 0,
});

export function AccessTokenProvider({ children }) {
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken") || "");
  const [refreshToken, setRefreshToken] = useState(sessionStorage.getItem("refreshToken") || "");
  const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
  const [nickname, setNickname] = useState(sessionStorage.getItem("nickname") || "");
  const [profileImageIndex, setProfileImageIndex] = useState(
    sessionStorage.getItem("profileImageIndex") || ""
  );
  const [classicPt, setClassicPt] = useState(sessionStorage.getItem("classicPt") || "0");
  const [itemPt, setItemPt] = useState(sessionStorage.getItem("itemPt") || "0");
  const [winNumItem, setWinNumItem] = useState(sessionStorage.getItem("winNumItem") || "0");
  const [loseNumItem, setLoseNumItem] = useState(sessionStorage.getItem("loseNumItem") || "0");
  const [winNumClassic, setWinNumClassic] = useState(
    sessionStorage.getItem("winNumClassic") || "0"
  );
  const [loseNumClassic, setLoseNumClassic] = useState(
    sessionStorage.getItem("loseNumClassic") || "0"
  );

  const [profile, setProfile] = useState(sessionStorage.getItem("profile") || "");

  useEffect(() => {
    if (profileImageIndex) {
      return setProfile(changeProfileImage().profileImagePath(profileImageIndex));
    }
  }, [profileImageIndex]);

  const clear = () => {
    setAccessToken("");
    setRefreshToken("");
    setEmail("");
    setNickname("");
    setProfileImageIndex("");
    setProfile("");
    setClassicPt("0");
    setItemPt("0");
    setWinNumItem("0");
    setLoseNumItem("0");
    setWinNumClassic("0");
    setLoseNumClassic("0");
  };

  useEffect(() => {
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("profileImageIndex", profileImageIndex);
    sessionStorage.setItem("profile", profile);
    sessionStorage.setItem("classicPt", classicPt);
    sessionStorage.setItem("itemPt", itemPt);
    sessionStorage.setItem("winNumItem", winNumItem);
    sessionStorage.setItem("loseNumItem", loseNumItem);
    sessionStorage.setItem("winNumClassic", winNumClassic);
    sessionStorage.setItem("loseNumClassic", loseNumClassic);
  }, [
    accessToken,
    refreshToken,
    email,
    nickname,
    profileImageIndex,
    profile,
    classicPt,
    winNumItem,
    loseNumItem,
    winNumClassic,
    loseNumClassic,
  ]);

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      email,
      setEmail,
      nickname,
      setNickname,
      profileImageIndex,
      setProfileImageIndex,
      profile,
      classicPt,
      setClassicPt,
      itemPt,
      setItemPt,
      winNumItem,
      setWinNumItem,
      loseNumItem,
      setLoseNumItem,
      winNumClassic,
      setWinNumClassic,
      loseNumClassic,
      setLoseNumClassic,

      clear,
    }),
    [
      accessToken,
      refreshToken,
      email,
      nickname,
      profileImageIndex,
      profile,
      classicPt,
      itemPt,
      winNumItem,
      loseNumItem,
      winNumClassic,
      loseNumClassic,
    ]
  );

  return <AccessTokenContext.Provider value={value}>{children}</AccessTokenContext.Provider>;
}

export function useAccessTokenState() {
  const context = useContext(AccessTokenContext);
  if (!context) {
    throw new Error("Cannot find AccessTokenProvider");
  }
  return context;
}
