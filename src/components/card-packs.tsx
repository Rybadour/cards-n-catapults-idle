import { useCallback, useContext } from 'react';
import { CardPacksContext } from '../contexts/card-packs';
import { RealizedCardPack } from '../shared/types';
import { formatNumber } from '../shared/utils';
import './card-packs.css';

export default function CardPacks() {
  const cardPacks = useContext(CardPacksContext);

  const onBuyPack = useCallback((cardPack: RealizedCardPack) => {
    cardPacks.buyPack(cardPack);
  }, [cardPacks]);

  return <div className="card-packs">
    <h4>Card Packs:</h4>
    <div className="card-pack-list">
    {Object.values(cardPacks.cardPacks).map(cardPack =>
      <div
        key={cardPack.id}
        className="card-pack"
        onClick={() => onBuyPack(cardPack)}
      >
        {cardPack.name}: {formatNumber(cardPack.cost, 0, 0)} gold
      </div>
    )}
    </div>
  </div>;
}