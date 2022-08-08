import './header.scss';
import Modal from 'react-modal';
import { useCallback, useContext, useState } from 'react';
import { PrestigeContext } from '../../contexts/prestige';
import { formatNumber } from '../../shared/utils';
import Icon from '../../shared/components/icon';
import HelpModal from './help-modal';
import OptionsModal from './options-modal';

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

Modal.setAppElement('#root');

function Header() {
  const prestige = useContext(PrestigeContext);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const onPrestige = useCallback(() => {
    prestige.prestige();
  }, [prestige]);

  const onOpenPrestigeMenu = useCallback(() => {
    prestige.openMenu();
  }, [prestige]);

  const onClosePrestigeMenu = useCallback(() => {
    prestige.closeMenu();
  }, [prestige]);

  return <header>
    <h1>Cards & Catapults Idle</h1>

    <div className="prestige">
      {prestige.isMenuOpen ? <>
        <button className="close-menu" onClick={() => onClosePrestigeMenu()}>
          {prestige.isReseting ? 'Back to Grid and Reset' : 'Return To Grid'}
        </button>
      </> : <>
        <button className="open-menu" onClick={() => onOpenPrestigeMenu()} data-tip="View Prestige Upgrades">
          <Icon size="sm" icon="upgrade" />
        </button>
        <button onClick={() => onPrestige()}>Prestige to get {formatNumber(prestige.nextPoints, 0, 0)} points</button>
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
      style={modalStyles}
      contentLabel="Help Tips"
      className="help-modal-content center-modal header-modal"
    >
      <HelpModal />
    </Modal>
    <Modal
      isOpen={isOptionsModalOpen}
      onRequestClose={() => setIsOptionsModalOpen(false)}
      style={modalStyles}
      contentLabel="Options"
      className="options-modal-content center-modal header-modal"
    >
      <OptionsModal />
    </Modal>
  </header>;
}

export default Header;