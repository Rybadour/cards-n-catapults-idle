import classNames from 'classnames';
import { useContext } from 'react';
import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import './card-list.css';

export default function CardList() {
  const cards = useContext(CardsContext);

  return <div className="card-list">
    {Object.values(cardsConfig).map(card =>
      <div
        key={card.id}
        className={classNames("card", {selected: card === cards.selectedCard})}
        onClick={() => cards.setSelectedCard(card)}
      >
        {card.name} {(cards.cards[card.id] ?? 0).toFixed(1)}x
      </div>
    )}
  </div>;
}