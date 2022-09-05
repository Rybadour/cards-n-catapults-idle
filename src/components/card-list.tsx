import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import classNames from 'classnames';
import { useCallback, useContext, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import { CardButton, CardButtons } from '../shared/components/card-buttons';
import Icon from '../shared/components/icon';
import { Card, CardType } from '../shared/types';
import { enumFromKey, formatNumber } from '../shared/utils';
import './card-list.scss';
import { CardMasteryContext, getMasteryBonus } from '../contexts/card-mastery';
import { STANDARD_MODAL_STYLE } from '../shared/constants';
import { useRecoilValue } from 'recoil';
import { cardsDiscoveredThisPrestigeAtom } from '../atoms/discover';

export default function CardList() {
  const [closedCategories, setClosedCategories] = useState<Partial<Record<CardType, boolean>>>({})
  const [currentMasteryCard, setCurrentMasteryCard] = useState<Card | null>(null)
  const cardsDiscoveredThisPrestige = useRecoilValue(cardsDiscoveredThisPrestigeAtom);

  const onToggleCategory = useCallback((cardType: CardType) => {
    const newClosedCategories = { ...closedCategories };
    newClosedCategories[cardType] = !newClosedCategories[cardType];
    setClosedCategories(newClosedCategories);
  }, [closedCategories]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cardsDiscoveredThisPrestige]);

  return <div className="card-inventory">
    <div className="title">Your Cards</div>
    <div className="cards">
    {Object.keys(CardType)
      .map(c => enumFromKey(CardType, c))
      .filter(cardType => cardType)
      .map(cardType => ({
        cardType,
        cardList: Object.values(cardsConfig)
          .filter(card => cardsDiscoveredThisPrestige[card.id] && card.type == cardType)
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
  const cards = useContext(CardsContext);
  const cardMastery = useContext(CardMasteryContext);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cardMastery]);

  const onSetMasteryCard = useCallback(() => {
    props.setMasteryCard(props.card);
  }, [props.card, props.setMasteryCard]);

  const masteryBonus = getMasteryBonus(cardMastery.cardMasteries[props.card.id], props.card) - 1;

  return <div className="card-container" key={props.card.id}>
    <div
      className={classNames("card", {
        selected: props.card === cards.selectedCard,
        empty: (cards.cards[props.card.id] ?? 0) <= 0,
      })}
      onClick={() => cards.setSelectedCard(props.card)}
    >
      <div className="title">
        <Icon size="sm" icon={props.card.icon} />
        <span className="name">{props.card.name}</span>
        <span className="amount">{formatNumber(cards.cards[props.card.id] ?? 0, 0, 1)}</span>
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
  const cardMastery = useContext(CardMasteryContext);

  const onSacrifice = useCallback((card: Card) => {
    cardMastery.sacrificeCard(card);
  }, [cardMastery]);

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
    <button onClick={() => onSacrifice(props.card!)}>Sacrifice Card for Mastery Bonus</button>
  </>;
}