import { useState } from "react";
import { SFX, playSFX } from "../utils/audioManager";

const useShowRodal = () => {
  const [value, setValue] = useState(false);

  const showRodal = () => {
    playSFX(SFX.POPUP);
    setValue(true);
  };

  const hideRodal = () => {
    playSFX(SFX.POPUP);
    setValue(false);
  };

  return {
    value,
    showRodal,
    hideRodal,
  };
};

export default useShowRodal;
