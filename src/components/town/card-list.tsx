import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { pick } from 'lodash';

import cardsConfig from '../../config/cards';
import { CardButton, CardButtons } from '../../shared/components/card-buttons';
import Icon from '../../shared/components/icon';
import { Card, CardType, ResourceType } from '../../shared/types';
import { enumFromKey, formatNumber } from '../../shared/utils';
import useStore from '../../store';
import { SectionHeader } from '../shared/common-styles';

import './card-list.scss';
import resourceIconMap from '../../config/resources';
import shallow from 'zustand/shallow';

export interface CardListProps {
  allowedCards: Record<CardType, boolean | string[]>,
}

export default function CardList(props: CardListProps) {
  const [closedCategories, setClosedCategories] = useState<Partial<Record<CardType, boolean>>>({})
  const cardsDiscovered = useStore(s => s.discovery.cardsDiscoveredThisPrestige);

  const onToggleCategory = useCallback((cardType: CardType) => {
    const newClosedCategories = { ...closedCategories };
    newClosedCategories[cardType] = !newClosedCategories[cardType];
    setClosedCategories(newClosedCategories);
  }, [closedCategories]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cardsDiscovered]);

  function isCardAllowed(card: Card) {
    const allowed = props.allowedCards[card.type];
    return typeof allowed === "boolean" ? allowed : allowed.includes(card.id);
  }

  return <div className="card-inventory">
    <SectionHeader>Market</SectionHeader>
    <div className="cards">
    {Object.keys(CardType)
      .map(c => enumFromKey(CardType, c))
      .filter(cardType => !!cardType && props.allowedCards[cardType])
      .map(cardType => ({
        cardType,
        cardList: Object.values(cardsConfig).filter(card => 
          cardsDiscovered[card.id] &&
          card.type == cardType &&
          isCardAllowed(card)
        )
      }))
      .filter(({cardList}) => cardList.length > 0)
      .map(({cardType, cardList}) =>
        <CardCategory
          key={cardType}
          cardType={cardType!}
          cardList={cardList}
          isOpen={closedCategories[cardType!] ?? false}
          onToggleCategory={onToggleCategory}
        />
      )
    }
    </div>
  </div>;
}

type CardCategoryProps = {
  cardType: CardType,
  cardList: Card[],
  isOpen: boolean,
  onToggleCategory: (cardType: CardType) => void
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
        <CardInInventory key={card.id} card={card} />
      )}
    </div>
  </div>
}

function CardInInventory(props: {card: Card}) {
  const cards = useStore(s => pick(s.cards, ['cards', 'selectedCard', 'setSelectedCard']), shallow);
  const cardDef = useStore(s => s.cardDefs.defs[props.card.id]);
  const cardTracking = cards.cards[props.card.id];

  return <div className="card-container" key={props.card.id}>
    <div
      className={classNames("card", {
        selected: props.card.id === cards.selectedCard,
      })}
      onClick={() => cards.setSelectedCard(props.card.id)}
    >
      <div className="title">
        <Icon size="sm" icon={cardDef.icon} />
        <span className="name">{cardDef.name}</span>
        <span className="amount">{formatNumber(cardTracking.numPurchased, 0, 1)}</span>
      </div>
      <div className="cost">
        <Icon size="xs" icon={resourceIconMap[ResourceType.Gold]} />
        <span>{formatNumber(cardTracking.cost, 0, 0)}</span>
      </div>

      <div className="description">{cardDef.description}</div>

      <div className="stats">
        <div className="tier" data-tip="Tier" data-offset="{'bottom': -5}">
          <Icon size="sm" icon="round-star" />
          <span className="value">{cardDef.tier}</span>
        </div>
        {cardDef.maxDurability ?
          <div className="stat" data-tip="Food capacity" data-offset="{'bottom': -5}">
            <Icon size="xs" icon="ham-shank" />
            <span>{formatNumber(cardDef.maxDurability, 0, 0)}</span>
          </div> :
          null
        }
        {cardDef.foodDrain ?
          <div className="stat" data-tip="Food Drain" data-offset="{'bottom': -5}">
            <Icon size="xs" icon="ham-shank" />
            <span>-{cardDef.foodDrain}/s</span>
          </div> :
          null
        }
        {cardDef.cooldownMs ?
          <div className="stat" data-tip="Cooldown" data-offset="{'bottom': -5}">
            <Icon size="xs" icon="backward-time" />
            <span>{formatNumber(cardDef.cooldownMs / 1000, 0, 0)}s</span>
          </div> :
          null
        }
      </div>
    </div>
  </div>;
}

/* *
TODO: Remember card buttons exist!
<CardButtons width={46}>
  <CardButton
    label={
      <span data-tip="Mastery Bonus" data-place="left" data-offset="{'left': 7}">
        <Icon icon="progression" size="xs" />
      </span>
    }
    onClick={() => {}}
  />
</CardButtons>
/* */
