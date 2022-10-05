import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import classNames from 'classnames';
import { useCallback, useContext, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import shallow from 'zustand/shallow';

import cardsConfig from '../config/cards';
import { CardButton, CardButtons } from '../shared/components/card-buttons';
import Icon from '../shared/components/icon';
import { Card, CardType } from '../shared/types';
import { enumFromKey, formatNumber } from '../shared/utils';
import './card-list.scss';
import { STANDARD_MODAL_STYLE } from '../shared/constants';
import useStore from '../store';
import { getMasteryBonus } from '../store/card-mastery';
import { pick } from 'lodash';

export default function CardList() {
  const [closedCategories, setClosedCategories] = useState<Partial<Record<CardType, boolean>>>({})
  const [currentMasteryCard, setCurrentMasteryCard] = useState<Card | null>(null)
  const cardsDiscovered = useStore(s => s.discovery.cardsDiscoveredThisPrestige);

  const onToggleCategory = useCallback((cardType: CardType) => {
    const newClosedCategories = { ...closedCategories };
    newClosedCategories[cardType] = !newClosedCategories[cardType];
    setClosedCategories(newClosedCategories);
  }, [closedCategories]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cardsDiscovered]);

  return <div className="card-inventory">
    <div className="title">Your Cards</div>
    <div className="cards">
    {Object.keys(CardType)
      .map(c => enumFromKey(CardType, c))
      .filter(cardType => cardType)
      .map(cardType => ({
        cardType,
        cardList: Object.values(cardsConfig)
          .filter(card => cardsDiscovered[card.id] && card.type == cardType)
      }))
      .filter(({cardType, cardList}) => cardList.length > 0)
      .map(({cardType, cardList}) =>
        <CardCategory
          key={cardType}
          cardType={cardType!}
          cardList={cardList}
          isOpen={closedCategories[cardType!] ?? false}
          onToggleCategory={onToggleCategory}
          setCurrentMasteryCard={setCurrentMasteryCard}
        />
      )
    }
    </div>

    <Modal
      isOpen={!!currentMasteryCard}
      onRequestClose={() => setCurrentMasteryCard(null)}
      style={STANDARD_MODAL_STYLE}
      contentLabel="Card Mastery"
      className="card-mastery-modal center-modal"
    >
      <CardMasteryModal card={currentMasteryCard} />
    </Modal>
  </div>;
}

type CardCategoryProps = {
  cardType: CardType,
  cardList: Card[],
  isOpen: boolean,
  onToggleCategory: (cardType: CardType) => void
  setCurrentMasteryCard: (card: Card | null) => void,
};
function CardCategory(props: CardCategoryProps) {
  const toggleCategory = useCallback(() => {
    props.onToggleCategory(props.cardType);
  }, [props.onToggleCategory, props.cardType]);

  return <div className="category">
    <div className="header" onClick={toggleCategory}>
      {props.isOpen ?
        <FontAwesomeIcon icon="chevron-up" /> :
        <FontAwesomeIcon icon="chevron-down" />
      }
      <span className="label">{props.cardType}</span>
    </div>
    <div className={classNames("card-list", {hidden: props.isOpen})}>
      {props.cardList.map(card =>
        <CardInInventory key={card.id} card={card} setMasteryCard={props.setCurrentMasteryCard} />
      )}
    </div>
  </div>
}

function CardInInventory(props: {card: Card, setMasteryCard: (card: Card | null) => void}) {
  const cards = useStore(s => s.cards.cards);
  const selectedCard = useStore(s => s.cards.selectedCard);
  const setSelectedCard = useStore(s => s.cards.setSelectedCard);
  const cardMasteries = useStore(s => s.cardMastery.cardMasteries);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cardMasteries]);

  const onSetMasteryCard = useCallback(() => {
    props.setMasteryCard(props.card);
  }, [props.card, props.setMasteryCard]);

  const masteryBonus = getMasteryBonus(cardMasteries[props.card.id], props.card) - 1;

  return <div className="card-container" key={props.card.id}>
    <div
      className={classNames("card", {
        selected: props.card === selectedCard,
        empty: (cards[props.card.id] ?? 0) <= 0,
      })}
      onClick={() => setSelectedCard(props.card)}
    >
      <div className="title">
        <Icon size="sm" icon={props.card.icon} />
        <span className="name">{props.card.name}</span>
        <span className="amount">{formatNumber(cards[props.card.id] ?? 0, 0, 1)}</span>
      </div>

      <div className="description">{props.card.description}</div>

      <div className="stats">
        <div className="tier" data-tip="Tier" data-offset="{'bottom': -5}">
          <Icon size="sm" icon="round-star" />
          <span className="value">{props.card.tier}</span>
        </div>
        {props.card.maxDurability ?
          <div className="stat" data-tip="Food capacity" data-offset="{'bottom': -5}">
            <span>{props.card.maxDurability}</span>
            <Icon size="xs" icon="ham-shank" />
          </div> :
          null
        }
        {props.card.foodDrain ?
          <div className="stat" data-tip="Food Drain" data-offset="{'bottom': -5}">
            <span>-{props.card.foodDrain}</span>
            <Icon size="xs" icon="ham-shank" />
            <span>/s</span>
          </div> :
          null
        }
        {props.card.cooldownMs ?
          <div className="stat" data-tip="Cooldown" data-offset="{'bottom': -5}">
            <span>{formatNumber(props.card.cooldownMs / 1000, 0, 0)}s</span>
            <Icon size="xs" icon="backward-time" />
          </div> :
          null
        }
        {masteryBonus > 0 ?
          <div className="stat" data-tip="Mastery Bonus" data-offset="{'bottom': -5}">
            <span>{formatNumber(masteryBonus * 100, 0, 0)}%</span>
            <Icon size="xs" icon="progression" />
          </div> :
          null
        }
      </div>
      <CardButtons width={46}>
        <CardButton
          label={
            <span data-tip="Mastery Bonus" data-place="left" data-offset="{'left': 7}">
              <Icon icon="progression" size="xs" />
            </span>
          }
          onClick={onSetMasteryCard}
        />
      </CardButtons>
    </div>
  </div>;
}

function CardMasteryModal(props: {card: Card | null}) {
  const {cardMasteries, sacrificeCard} = useStore(s => pick(s.cardMastery, ['cardMasteries', 'sacrificeCard']), shallow);

  const onSacrifice = useCallback((card: Card) => {
    sacrificeCard(card);
  }, [sacrificeCard]);

  if (!props.card) return null;

  const masteryBonusPer = props.card.mastery.bonusPer * 100;
  const mastery = cardMasteries[props.card.id];
  return <>
    <h3>Card Mastery for {props.card.name}</h3>
    <Icon icon={props.card.icon} size="lg" />
    <div className="card-mastery-bonus">+{mastery.level * masteryBonusPer}%</div>

    <div className="card-mastery-progress">
      <span>{mastery.currentSpent}</span>
      <span>/</span>
      <span>{mastery.currentCost}</span>
    </div>
    <div>+{masteryBonusPer}%</div>
    <button onClick={() => onSacrifice(props.card!)}>Sacrifice Card for Mastery Bonus</button>
  </>;
}