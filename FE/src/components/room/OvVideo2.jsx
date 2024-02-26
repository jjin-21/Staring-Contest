import React, { useRef, useEffect, forwardRef } from "react";

const OpenViduVideoComponent = forwardRef(({ streamManager }, ref) => {
  useEffect(() => {
    if (streamManager && ref.current) {
      streamManager.addVideoElement(ref.current);
    }
  }, [streamManager, ref]);

  return <video style={{ borderRadius: "6rem", maxWidth: "70%" }} ref={ref} autoPlay={true} />;
});

export default OpenViduVideoComponent;
