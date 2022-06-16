import classNames from 'classnames';
import { useContext } from 'react';
import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import { DiscoveryContext } from '../contexts/discovery';
import { formatNumber } from '../shared/utils';
import './card-list.scss';

export default function CardList() {
  const cards = useContext(CardsContext);
  const discovery = useContext(DiscoveryContext);

  return <div className="card-list">
    {Object.values(cardsConfig)
    .filter(card => discovery.discoveredCards[card.id])
    .map(card =>
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
        </div>

        <div className="description">{card.description}</div>

        <span className="amount">{formatNumber(cards.cards[card.id] ?? 0, 0, 1)}</span>
      </div>
    )}
  </div>;
}