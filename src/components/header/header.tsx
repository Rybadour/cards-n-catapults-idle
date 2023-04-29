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
import { AutoLoadToasts } from './auto-load-toasts';
import { Scene } from '../../store/scenes';
import classNames from 'classnames';

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

  const scenes = useStore(s => pick(
    s.scenes, [ 'currentScene', 'switchScene' ]
  ), shallow);
  
  const onSwitchScene = useCallback((scene) => {
    scenes.switchScene(scene);
  }, [scenes.switchScene]);

  const sceneList = [Scene.Economy, Scene.Prestige, Scene.Combat];

  return <>
    <header>
      <h1>Swords & Spades Idle</h1>

      <div className="options">
        <button className="no-style" onClick={() => setIsHelpModalOpen(true)} data-tip="Help">
          <Icon size="sm" icon="help" />
        </button>
        <button className="no-style" onClick={() => setIsOptionsModalOpen(true)} data-tip="Options">
          <Icon size="sm" icon="settings-knobs" />
        </button>
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

      <AutoLoadToasts />
    </header>
    <div className="scene-tabs">
      {sceneList.map(s =>
        <button
          key={s}
          className={classNames({current: s === scenes.currentScene})}
          onClick={() => onSwitchScene(s)}
        >{s}</button>
      )}
    </div>
  </>;
}

export default Header;