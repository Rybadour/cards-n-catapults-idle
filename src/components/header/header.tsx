import Modal from 'react-modal';
import { useCallback, useState } from 'react';
import { pick } from 'lodash';
import shallow from 'zustand/shallow';

import { formatNumber } from '../../shared/utils';
import Icon from '../../shared/components/icon';
import HelpModal from './help-modal';
import OptionsModal from './options-modal';
import { STANDARD_MODAL_STYLE } from '../../shared/constants';
import useStore from '../../store';

import './header.scss';
import PrestigePromptModal from './prestige-prompt-modal';

Modal.setAppElement('#root');

function Header() {
  const prestige = useStore(s => pick(
    s.prestige, [
      'prestigeAndSacrificeAll', 'openMenu', 'closeMenu', 'isMenuOpen', 'isReseting', 'nextPoints', 'nextRenownCost',
      'shouldAutoSacrificeAll', 'isPromptOpen', 'openPrompt'
    ]
  ), shallow);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const onPrestige = useCallback(() => {
    if (prestige.nextPoints <= 0) return;

    if (prestige.shouldAutoSacrificeAll) {
      prestige.prestigeAndSacrificeAll();
    } else {
      prestige.openPrompt();
    }
  }, [prestige.nextPoints, prestige.prestigeAndSacrificeAll, prestige.shouldAutoSacrificeAll, prestige.openPrompt]);

  const onOpenPrestigeMenu = useCallback(() => {
    prestige.openMenu();
  }, [prestige.openMenu]);

  const onClosePrestigeMenu = useCallback(() => {
    prestige.closeMenu();
  }, [prestige.closeMenu]);

  return <header>
    <h1>Cards & Catapults Idle</h1>

    <div className="prestige">
      {prestige.isMenuOpen ? <>
        <button className="close-menu" onClick={onClosePrestigeMenu}>
          {prestige.isReseting ? 'Back to Grid and Reset' : 'Return To Grid'}
        </button>
      </> : <>
        <button className="open-menu" onClick={onOpenPrestigeMenu} data-tip="View Prestige Upgrades">
          <Icon size="sm" icon="upgrade" />
        </button>
        <button onClick={onPrestige}>Prestige to get {formatNumber(prestige.nextPoints, 0, 0)} points</button>
        <span>Next at {formatNumber(prestige.nextRenownCost, 0, 0)} Renown</span>
      </>}
    </div>

    <div className="options">
      <button onClick={() => setIsHelpModalOpen(true)}>Help</button>
      <button onClick={() => setIsOptionsModalOpen(true)}>Options</button>
    </div>

    <Modal
      isOpen={isHelpModalOpen}
      onRequestClose={() => setIsHelpModalOpen(false)}
      style={STANDARD_MODAL_STYLE}
      contentLabel="Help Tips"
      className="help-modal-content center-modal header-modal"
    >
      <HelpModal />
    </Modal>
    <Modal
      isOpen={isOptionsModalOpen}
      onRequestClose={() => setIsOptionsModalOpen(false)}
      style={STANDARD_MODAL_STYLE}
      contentLabel="Options"
      className="options-modal-content center-modal header-modal"
    >
      <OptionsModal />
    </Modal>
    <PrestigePromptModal />
  </header>;
}

export default Header;