import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import classNames from 'classnames';
import { useCallback, useContext, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import { DiscoveryContext } from '../contexts/discovery';
import { CardButton, CardButtons } from '../shared/components/card-buttons';
import Icon from '../shared/components/icon';
import { Card, CardType } from '../shared/types';
import { enumFromKey, formatNumber } from '../shared/utils';
import './card-list.scss';
import { CardMasteryContext } from '../contexts/card-mastery';

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

export default function CardList() {
  const [closedCategories, setClosedCategories] = useState<Partial<Record<CardType, boolean>>>({})
  const cards = useContext(CardsContext);
  const discovery = useContext(DiscoveryContext);

  const [currentMasteryCard, setCurrentMasteryCard] = useState<Card | null>(null)

  const onToggleCategory = useCallback((cardType: CardType) => {
    const newClosedCategories = { ...closedCategories };
    newClosedCategories[cardType] = !newClosedCategories[cardType];
    setClosedCategories(newClosedCategories);
  }, [closedCategories]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [discovery]);

  return <div className="card-inventory">
    <div className="title">Your Cards</div>
    <div className="cards">
    {Object.keys(CardType)
      .map(c => enumFromKey(CardType, c))
      .filter(cardType => cardType)
      .map(cardType => ({
        cardType,
        cardList: Object.values(cardsConfig)
          .filter(card => discovery.cardsDiscoveredThisPrestige[card.id] && card.type == cardType)
      }))
      .filter(({cardType, cardList}) => cardList.length > 0)
      .map(({cardType, cardList}) =>
      <div className="category" key={cardType}>
        <div className="header" onClick={() => onToggleCategory(cardType!!)}>
          {closedCategories[cardType!!] ?
            <FontAwesomeIcon icon="chevron-up" /> :
            <FontAwesomeIcon icon="chevron-down" />
          }
          <span className="label">{cardType}</span>
        </div>
        <div className={classNames("card-list", {hidden: closedCategories[cardType!!]})}>
          {cardList.map(card =>
            <div className="card-container" key={card.id}>
              <div
                className={classNames("card", {
                  selected: card === cards.selectedCard,
                  empty: (cards.cards[card.id] ?? 0) <= 0,
                })}
                onClick={() => cards.setSelectedCard(card)}
              >
                <div className="title">
                  <Icon size="sm" icon={card.icon} />
                  <span className="name">{card.name}</span>
                  <span className="amount">{formatNumber(cards.cards[card.id] ?? 0, 0, 1)}</span>
                </div>

                <div className="description">{card.description}</div>

                <div className="stats">
                  {card.maxDurability ? 
                    <div className="stat" data-tip="Food capacity" data-offset="{'bottom': -5}">
                      <span>{card.maxDurability}</span>
                      <Icon size="xs" icon="ham-shank" />
                    </div>:
                    null
                  }
                  {card.foodDrain ? 
                    <div className="stat" data-tip="Food Drain" data-offset="{'bottom': -5}">
                      <span>-{card.foodDrain}</span>
                      <Icon size="xs" icon="ham-shank" />
                      <span>/s</span>
                    </div>:
                    null
                  }
                  <div className="tier" data-tip="Tier" data-offset="{'bottom': -5}">
                    <Icon size="sm" icon="round-star" />
                    <span className="value">{card.tier}</span>
                  </div>
                </div>
                <CardButtons width={46}>
                  <CardButton label={<Icon icon="progression" size="xs" />} onClick={() => setCurrentMasteryCard(card)} />
                </CardButtons>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </div>

    <Modal
      isOpen={!!currentMasteryCard}
      onRequestClose={() => setCurrentMasteryCard(null)}
      style={modalStyles}
      contentLabel="Card Mastery"
      className="card-mastery-modal center-modal"
    >
      <CardMasteryModal card={currentMasteryCard} />
    </Modal>
  </div>;
}

function CardMasteryModal(props: {card: Card | null}) {
  const cards = useContext(CardsContext);
  const cardMastery = useContext(CardMasteryContext);

  const onSacrifice = useCallback((card: Card) => {
    cardMastery.sacrificeCard(card);
  }, [cardMastery, cards]);

  if (!props.card) return null;

  const masteryBonusPer = props.card.mastery.bonusPer * 100;
  const mastery = cardMastery.cardMasteries[props.card.id];
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
    <button onClick={() => onSacrifice(props.card!!)}>Sacrifice Card for Mastery Bonus</button>
  </>;
}