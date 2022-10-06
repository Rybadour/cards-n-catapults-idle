import Modal from 'react-modal';
import { pick } from 'lodash';
import shallow from 'zustand/shallow';
import { STANDARD_MODAL_STYLE } from '../../shared/constants';

import useStore from '../../store';

import './prestige-prompt-modal.scss';

function PrestigePromptModal() {
  const prestige = useStore(s => pick(
    s.prestige, [
      'isPromptOpen'
    ]
  ), shallow);

  return <Modal
    isOpen={prestige.isPromptOpen}
    style={STANDARD_MODAL_STYLE}
    contentLabel="Prestige Prompt"
    className="prestige-prompt-modal-content center-modal header-modal"
  >
    <div>
      <h2>Before you prestige...</h2>
    </div>
  </Modal>;
}

export default PrestigePromptModal;