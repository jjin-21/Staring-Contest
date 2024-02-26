import { useEffect } from "react";
import { BGM_MAP, SFX_MAP } from "../constants/soundMap";

export const BGM = BGM_MAP;
export const SFX = SFX_MAP;

export const playBGM = (src) => {
  useEffect(() => {
    let bgm;

    bgm = createBGMInstance(src);

    return () => {
      bgm.pause();
      bgm.src = "";
    };
  }, []);
};

export const createBGMInstance = (src) => {
  const bgm = new Audio(src);

  bgm.autoplay = true;
  bgm.loop = true;
  bgm.volume = 0.2;

  bgm.play().catch((error) => {
    console.error("BGM play failed:", error);
  });

  return bgm;
};

export const playSFX = (src) => {
  const sfx = new Audio(src);

  sfx.play().catch((error) => {
    console.error("SFX play failed:", error);
  });
};
