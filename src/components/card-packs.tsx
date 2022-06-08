import { useCallback, useContext } from 'react';
import cardPacks from '../config/card-packs';
import { CardsContext } from '../contexts/cards';
import { GridContext } from '../contexts/grid';
import { buyPack } from '../gamelogic/grid-cards';
import { CardPack } from '../shared/types';
import './card-packs.css';

export default function CardPacks() {
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);

  const onBuyPack = useCallback((cardPack: CardPack) => {
    buyPack(grid, cards, cardPack);
  }, [grid, cards]);

  return <div className="card-packs">
    {Object.values(cardPacks).map(cardPack =>
      <div
        className="card-pack"
        onClick={() => onBuyPack(cardPack)}
      >
        {cardPack.name}: {cardPack.cost} gold
      </div>
    )}
  </div>;
}