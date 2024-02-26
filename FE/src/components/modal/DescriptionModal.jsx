import Rodal from "rodal";
import "rodal/lib/rodal.css";

const DescriptionModal = ({ visible, onClose }) => {
  return (
    <>
      <Rodal visible={visible} onClose={onClose}>
        게임설명~~~~~~~~~~~~~~~~
      </Rodal>
    </>
  );
};

export default DescriptionModal;
