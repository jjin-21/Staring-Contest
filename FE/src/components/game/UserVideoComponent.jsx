import { useEffect, useState, useRef } from "react";
import { useAccessTokenState } from "@/context/AccessTokenContext";
import OpenViduVideoComponent from "./OvVideo";
import nickname_plate from "../../assets/img/nickname_plate.png";
import frame from "../../assets/img/frame.png";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

function euclideanDistance(pointA, pointB) {
  const distance = Math.sqrt(
    Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)
  );
  return distance;
}

// 눈의 종횡비(EAR) 계산 함수
function calculateEAR(eyePoints) {
  // 눈의 수직 거리 계산 (눈의 위쪽과 아래쪽 랜드마크 사이)
  const vertical_1 = euclideanDistance(eyePoints[1], eyePoints[8]);
  const vertical_2 = euclideanDistance(eyePoints[2], eyePoints[9]);
  const vertical_3 = euclideanDistance(eyePoints[3], eyePoints[10]);
  const vertical_4 = euclideanDistance(eyePoints[4], eyePoints[11]);

  // 눈의 수평 거리 계산 (눈의 양쪽 끝 랜드마크 사이)
  const horizontal = euclideanDistance(eyePoints[15], eyePoints[14]);

  // EAR 계산
  const ear = (vertical_1 + vertical_2 + vertical_3 + vertical_4) / (3.0 * horizontal);
  return ear;
}

export default function UserVideoComponent({
  streamManager,
  gameState,
  sendLose,
  myLose,
  opponentLose,
  // faceLandmarker,
}) {
  const videoRef = useRef(null);
  const myInfo = useAccessTokenState();

  const faceLandmarker = useRef(undefined);

  useEffect(() => {
    if (streamManager && gameState === "play") {
      async function createFaceLandmarker() {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarker.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            // delegate: "GPU",
          },
          // outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
      }
      createFaceLandmarker();
      const detect = async () => {
        if (videoRef.current && videoRef.current.readyState >= 4 && faceLandmarker.current) {
          const faceLandmarkerResult = await faceLandmarker.current.detectForVideo(
            videoRef.current,
            performance.now()
          );
          if (faceLandmarkerResult.faceLandmarks.length > 0) {
            const faceLandmarks = faceLandmarkerResult.faceLandmarks[0];
            // 왼쪽 눈
            const leftEyeUpperLandmarks = [173, 157, 158, 159, 160, 161, 246].map(
              (i) => faceLandmarks[i]
            );
            const leftEyeLowerLandmarks = [155, 154, 153, 145, 144, 163, 7].map(
              (i) => faceLandmarks[i]
            );
            const leftEyeInnerLandmarks = [faceLandmarks[133]];
            const leftEyeOuterLandmarks = [faceLandmarks[33]];

            // 오른쪽 눈
            const rightEyeUpperLandmarks = [398, 384, 385, 386, 387, 388, 466].map(
              (i) => faceLandmarks[i]
            );
            const rightEyeLowerLandmarks = [382, 381, 380, 374, 373, 390, 249].map(
              (i) => faceLandmarks[i]
            );
            const rightEyeInnerLandmarks = [faceLandmarks[362]];
            const rightEyeOuterLandmarks = [faceLandmarks[263]];

            const leftEyeLandmarks = [
              ...leftEyeUpperLandmarks,
              ...leftEyeLowerLandmarks,
              ...leftEyeInnerLandmarks,
              ...leftEyeOuterLandmarks,
            ];
            const leftEye = leftEyeLandmarks.map((landmark) => [landmark.x, landmark.y]);
            const rightEyeLandmarks = [
              ...rightEyeUpperLandmarks,
              ...rightEyeLowerLandmarks,
              ...rightEyeInnerLandmarks,
              ...rightEyeOuterLandmarks,
            ];
            const rightEye = rightEyeLandmarks.map((landmark) => [landmark.x, landmark.y]);

            const leftEAR = calculateEAR(leftEye);
            const rightEAR = calculateEAR(rightEye);

            if (leftEAR < 0.12 || rightEAR < 0.12) {
              sendLose();
            }
          }
        }
        // requestAnimationFrame(detect);
      };
      // detect();
      const intervalId = setInterval(detect, 1000 / 30);
      return () => clearInterval(intervalId);
    }
  }, [streamManager]);

  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div className="flex ">
      {streamManager !== undefined ? (
        <div className="m-5 flex flex-col items-center justify-center ">
          <OpenViduVideoComponent streamManager={streamManager} ref={videoRef} />
          <div className="flex flex-row m-2">
            <div>
              <img
                src={myInfo.profile}
                style={{
                  width: "50px",
                  backgroundImage: `url(${frame})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100%",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div
              className="p-3"
              style={{
                backgroundImage: `url(${nickname_plate})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                fontSize: "20px",
              }}
            >
              {getNicknameTag()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
