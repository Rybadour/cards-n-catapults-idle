import ReactModal from "react-modal";
import { STANDARD_MODAL_STYLE } from "../shared/constants";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal(props: TutorialModalProps) {
  return <ReactModal
    isOpen={props.isOpen}
    onRequestClose={props.onClose}
    style={STANDARD_MODAL_STYLE}
    contentLabel="Help Tips"
    className="help-modal-content center-modal header-modal"
  >
    <h3>Welcome to Swords & Spades Idle!</h3>
    <p>Some quick tips before you begin:</p>
    <ul>
      <li>Workers needs food to work, food must be placed next to every worker in the grid. (orthogonally)</li>
      <li>Select a worker or food in the market then click a tile in the grid to buy it and place it.</li>
      <li>To sell wood hover over it.</li>
      <li>You can access these tips and more in the top right.</li>
      <li>For the time being saving is disabled, be careful not to refresh the page!</li>
      <li>Current end game is unlocking the bronze age.</li>
    </ul>
    <p>Have fun!</p>
  </ReactModal>
}