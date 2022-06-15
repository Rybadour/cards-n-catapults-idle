import { useCallback, useContext } from 'react';
import cardPacks from '../config/card-packs';
import { CardsContext } from '../contexts/cards';
import { CardPack } from '../shared/types';
import './card-packs.css';

export default function CardPacks() {
  const cards = useContext(CardsContext);

  const onBuyPack = useCallback((cardPack: CardPack) => {
    cards.buyPack(cardPack);
  }, [cards]);

  return <div className="card-packs">
    <h4>Card Packs:</h4>
    <div className="card-pack-list">
    {Object.values(cardPacks).map(cardPack =>
      <div
        key={cardPack.id}
        className="card-pack"
        onClick={() => onBuyPack(cardPack)}
      >
        {cardPack.name}: {cardPack.cost} gold
      </div>
    )}
    </div>
  </div>;
}