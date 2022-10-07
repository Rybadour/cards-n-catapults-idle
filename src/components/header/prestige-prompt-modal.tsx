import Modal from 'react-modal';
import { pick } from 'lodash';
import shallow from 'zustand/shallow';
import { useCallback } from 'react';

import { STANDARD_MODAL_STYLE } from '../../shared/constants';
import useStore from '../../store';

import './prestige-prompt-modal.scss';

function PrestigePromptModal() {
  const prestige = useStore(s => pick(
    s.prestige, [
      'isPromptOpen', 'closePrompt', 'shouldAutoSacrificeAll', 'toggleShouldAutoSacrifice', 'prestige', 'prestigeAndSacrificeAll'
    ]
  ), shallow);

  return <Modal
    isOpen={prestige.isPromptOpen}
    onRequestClose={() => prestige.closePrompt()}
    style={STANDARD_MODAL_STYLE}
    contentLabel="Prestige Prompt"
    className="top-center-modal header-modal"
  >
    <div className="prestige-prompt">
      <h2>Before you prestige...</h2>

      <p>Would you like to automatically sacrifice all cards for a mastery bonus? This is completely harmless if you
        intend to prestige right now!</p>

      <div>
        <label>
          <span>Automatically sacrifice all cards on prestige?</span>
          <input type="checkbox" checked={prestige.shouldAutoSacrificeAll} onChange={prestige.toggleShouldAutoSacrifice}></input>
        </label>
      </div>

      <div className="action-buttons">
        <button onClick={prestige.prestigeAndSacrificeAll}>Prestige and Sacrifice all</button>
        <button onClick={prestige.prestige}>Only Prestige</button>
      </div>
    </div>
  </Modal>;
}

export default PrestigePromptModal;