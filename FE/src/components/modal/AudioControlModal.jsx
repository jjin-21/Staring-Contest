import Rodal from "rodal";
import "rodal/lib/rodal.css";

const AudioControlModal = ({
  isVisible,
  hideModal,
  toggleAudio,
  selectedAudioOption,
  setSelectedAudioOption,
  myTeam,
  teamA,
  teamB,
}) => {
  return (
    <Rodal visible={isVisible} onClose={hideModal} height={300} width={300} animation="slideUp">
      <h2>음성 제어</h2>
      <div className="h-5/6 flex flex-col justify-center items-center">
        <button
          onClick={() => {
            // toggleAudio(teamA, true);
            // toggleAudio(teamB, true);
            setSelectedAudioOption("all");
          }}
          className={`rounded-full active:animate-rotate-x active:animate-duration-500 w-1/3 h-1/3 m-4 ${selectedAudioOption === "all" ? "bg-green-500" : "bg-gray-400"}`}
        >
          전체
        </button>
        <button
          onClick={() => {
            // toggleAudio(myTeam === "A" ? teamB : teamA, false);
            // toggleAudio(myTeam === "A" ? teamA : teamB, true);
            setSelectedAudioOption("team");
          }}
          className={`rounded-full active:animate-rotate-x active:animate-duration-500 w-1/3 h-1/3 m-4 ${selectedAudioOption === "team" ? "bg-green-500" : "bg-gray-400"}`}
        >
          팀
        </button>
        <button
          onClick={() => {
            // toggleAudio(teamA, false);
            // toggleAudio(teamB, false);
            setSelectedAudioOption("off");
          }}
          className={`rounded-full active:animate-rotate-x active:animate-duration-500 w-1/3 h-1/3 m-4 ${selectedAudioOption === "off" ? "bg-green-500" : "bg-gray-400"}`}
        >
          끄기
        </button>
      </div>
    </Rodal>
  );
};

export default AudioControlModal;
