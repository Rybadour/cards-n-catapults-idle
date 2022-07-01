import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useContext, useState } from 'react';
import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import { DiscoveryContext } from '../contexts/discovery';
import { CardType } from '../shared/types';
import { enumFromKey, formatNumber } from '../shared/utils';
import './card-list.scss';

export default function CardList() {
  const [closedCategories, setClosedCategories] = useState<Partial<Record<CardType, boolean>>>({})
  const cards = useContext(CardsContext);
  const discovery = useContext(DiscoveryContext);

  const onToggleCategory = useCallback((cardType: CardType) => {
    const newClosedCategories = { ...closedCategories };
    newClosedCategories[cardType] = !newClosedCategories[cardType];
    setClosedCategories(newClosedCategories);
  }, [closedCategories]);

  return <div className="card-inventory">
    <div className="title">Your Cards</div>
    <div className="cards">
    {Object.keys(CardType)
      .map(c => enumFromKey(CardType, c))
      .filter(cardType => cardType)
      .map(cardType => ({
        cardType,
        cardList: Object.values(cardsConfig)
          .filter(card => discovery.discoveredCards[card.id] && card.type == cardType)
      }))
      .filter(({cardType, cardList}) => cardList.length > 0)
      .map(({cardType, cardList}) =>
      <div className="category">
        <div className="header" onClick={() => onToggleCategory(cardType!!)}>
          {closedCategories[cardType!!] ?
            <FontAwesomeIcon icon="chevron-up" /> :
            <FontAwesomeIcon icon="chevron-down" />
          }
          <span className="label">{cardType}</span>
        </div>
        <div className={classNames("card-list", {hidden: closedCategories[cardType!!]})}>
          {cardList.map(card =>
            <div
              key={card.id}
              className={classNames("card", {
                selected: card === cards.selectedCard,
                empty: (cards.cards[card.id] ?? 0) <= 0,
              })}
              onClick={() => cards.setSelectedCard(card)}
            >
              <div className="title">
                <img src={`icons/${card.icon}.png`} />
                <span>{card.name}</span>
                <span className="tier">
                  <img src='icons/round-star.png' />
                  <span className="value">{card.tier}</span>
                </span>
              </div>

              <div className="description">{card.description}</div>

              <div className="stats">
                {card.maxDurability ? 
                  <div className="stat">
                    <span>{card.maxDurability}</span>
                    <img src="icons/ham-shank.png" />
                  </div>:
                  null
                }
                {card.foodDrain ? 
                  <div className="stat">
                    <span>-{card.foodDrain}</span>
                    <img src="icons/ham-shank.png" />
                    <span>/s</span>
                  </div>:
                  null
                }
              </div>
              <span className="amount">{formatNumber(cards.cards[card.id] ?? 0, 0, 1)}</span>
            </div>
          )}
        </div>
      </div>
    )}
    </div>
  </div>;
}