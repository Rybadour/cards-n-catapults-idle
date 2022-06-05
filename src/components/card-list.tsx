import classNames from 'classnames';
import { useContext } from 'react';
import cards from '../config/cards';
import { GridContext } from '../contexts/grid';
import './card-list.css';

export default function CardList() {
  const grid = useContext(GridContext);

  return <div className="card-list">
    {Object.values(cards).map(card =>
      <div
        className={classNames("card", {selected: card === grid.selectedCard})}
        onClick={() => grid.setSelectedCard(card)}
      >
        {card.name}
      </div>
    )}
  </div>;
}