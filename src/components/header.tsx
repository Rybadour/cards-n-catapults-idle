import './header.scss';
import Modal from 'react-modal';
import { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';
import { PrestigeContext } from '../contexts/prestige';
import { formatNumber } from '../shared/utils';
import { StatsContext } from '../contexts/stats';
import { GridContext } from '../contexts/grid';
import { CardsContext } from '../contexts/cards';
import { CardPacksContext } from '../contexts/card-packs';
import { DiscoveryContext } from '../contexts/discovery';
import Icon from '../shared/components/icon';
import { SavingLoadingContext } from '../contexts/saving-loading';

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

Modal.setAppElement('#root');

function Header() {
  const prestige = useContext(PrestigeContext);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const savingLoading = useContext(SavingLoadingContext);
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

  const onSave = useCallback(() => {
    savingLoading.save();
  }, [savingLoading]);
  const onLoad = useCallback(() => {
    savingLoading.load();
  }, [savingLoading]);

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
        <span>Next at {formatNumber(prestige.currentRenownCost + prestige.nextRenownCost, 0, 0)} Renown</span>
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
      className="help-modal-content header-modal"
    >
      <HelpModal />
    </Modal>
    <Modal
      isOpen={isOptionsModalOpen}
      onRequestClose={() => setIsOptionsModalOpen(false)}
      style={modalStyles}
      contentLabel="Options"
      className="options-modal-content header-modal"
    >
      <button onClick={() => onSave()}>Save</button>
      <button onClick={() => onLoad()}>Load</button>
    </Modal>
  </header>;
}

function HelpModal() {
  const [selected, setSelected] = useState('controls');

  const helpTips = [{
    id: 'controls',
    title: 'Controls',
  }, {
    id: 'food-drain',
    title: 'Food Drain',
  }, {
    id: 'expired-food',
    title: 'Expired Food',
  }, {
    id: 'produce-cards',
    title: 'Card Production',
  }, {
    id: 'bonuses',
    title: 'Bonuses',
  }]

  return <div>
    <h2>Help Tips</h2>

    <div className="help-body-wrapper">
      <ul className="help-tip-menu">
        {helpTips.map(tip => 
          <li
            className={classNames({selected: tip.id == selected})}
            onClick={() => setSelected(tip.id)}
          >{tip.title}</li>
        )}
      </ul>
      <div className="help-body">
        <div className={classNames({selected: selected == 'controls'})}>
          <h3>Controls</h3>
          <p>To place a card select it by clicking on it then <b>left clicking on the grid</b>. If a card is already in that
          space it will <b>replace it</b> and the existing card will <b>go back to your inventory</b>.</p>
          <p>To remove a card from the grid you <b>right click it</b>.</p>
          <p>When removing a food card it will <b>retain its remaining capacity</b> in the form of a decimal number. Ex. If
          you remove a food card at half capacity it will be returned to your inventory as 0.5 of a card. When placing
          a food card you can place that fraction of a card and it will place it at the remaining capacity.</p>
        </div>

        <div className={classNames({selected: selected == 'food-drain'})}>
          <h3>Food Drain</h3>
          <p>You’ll find that most person cards (Beggars and Peasants) and some special cards will have a food drain stat.
          This is the rate at which they eat food and it’s always listed as per second. Cards generally eat food that is
          adjacent to them (orthogonally) and will eat food from all those cards at an equal rate.</p>
          <p>Ex. In these screenshots we have a Beggar next to one food card and another Beggar surrounded by food cards.</p>
          <img className="help-screenshot" src="food-drain-screenshot1.png" />
          <p>A Beggar eats food at 0.2 units per second so in the first screenshot it will eat that food card at 0.2
          units per second. In the second since it’s surrounded by 4 food cards each will be drained at <b>¼ the speed</b> or
          0.05 units per second. This means that each food card will <b>last 4 times as long.</b></p>
        </div>

        <div className={classNames({selected: selected == 'expired-food'})}>
          <h3>Expired Food</h3>

          <p>You may notice that when food is completely used up it remains as faded out. In this state the card is
          completely disabled but it’s used as an indicator that it can be automatically replaced. Some cards will
          automatically replace food cards and they will only do this based on these expired food tiles. Cards that
          generate cards adjacent to them can override these expired food tiles and place different cards there
          automatically.</p>
        </div>

        <div className={classNames({selected: selected == 'produce-cards'})}>
          <h3>Cards that Produce Cards</h3>

          <p>Some cards will constantly produce cards for free. Generally they place these cards in adjacent tiles
            (orthogonally) but sometimes they send them straight to your inventory such as with the Pig Pen. If all
            adjacent tiles are occupied the produced card will go into the inventory.
          </p>
        </div>

        <div className={classNames({selected: selected == 'bonuses'})}>
          <h3>Bonuses</h3>

          <p>Some cards mention "improving" other cards. This means to increase their production by that amount or to
          speed up their abilities by that amount. Production bonuses are applied multiplicatively. You can tell if a
          card is apply a bonus to another card by hovering over the bonus applying card. Cards that it's applying a
          bonus to will be highlighted green.
          </p>
        </div>
      </div>
    </div>
  </div>;
}

export default Header;