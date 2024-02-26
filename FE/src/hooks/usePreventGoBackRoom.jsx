import { useEffect } from "react";
import { toast } from "react-toastify";

export const usePreventGoBackRoom = () => {
  useEffect(() => {
    const preventGoBack = () => {
      history.pushState(null, "", location.href);
      toast.dismiss();
      toast.warn("왼쪽 상단의 방 나가기 버튼을 클릭하여야 정상적으로 방에서 나갈 수 있습니다.", {
        position: "top-center",
      });
    };

    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);
};
