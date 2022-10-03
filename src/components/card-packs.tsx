import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import shallow from 'zustand/shallow';

import { CardPacksContext } from '../contexts/card-packs';
import Icon from '../shared/components/icon';
import { Rarity, RealizedCardPack } from '../shared/types';
import { formatNumber } from '../shared/utils';
import useStore from '../store';
import './card-packs.scss';

export default function CardPacks() {
  const cp = useContext(CardPacksContext);
  //const stats = useContext(StatsContext);
  
  const cardPacks = useStore(s => s.cardPacks.cardPacks);
  const buyPack = useStore(s => s.cardPacks.buyPack);
  const discoveredCardPacks = useStore(s => s.discovery.discoveredCardPacks);
  const discoveredCards = useStore(s => s.discovery.discoveredCards);

  const onBuyPack = useCallback((cardPack: RealizedCardPack) => {
    buyPack(cardPack);
  }, [buyPack]);

  const onBuyMaxPack = useCallback((cardPack: RealizedCardPack) => {
    cp.buyMaxPack(cardPack);
  }, [cardPacks]);

  return <div className="card-packs">
    <h4>Card Packs</h4>
    <div className="card-pack-list">
    {Object.values(cardPacks)
    .filter(pack => discoveredCardPacks[pack.id])
    .map(cardPack =>
      <div
        key={cardPack.id}
        className="card-pack"
      >
        <div className="name">{cardPack.name}</div>

        <div className="cards">
          {cardPack.possibleThings.map(({thing: card}) => 
            <div
              className={classNames("possible-card", {
                discovered: discoveredCards[card.id],
                'rare': card.rarity == Rarity.Rare,
                'ultra-rare': card.rarity == Rarity.UltraRare,
              })}
              key={card.id}
              data-tip={discoveredCards[card.id] ? card.name : "Undiscovered " + card.rarity}
            >
              {discoveredCards[card.id] ? 
                <Icon size="xs" icon={card.icon} /> :
                <FontAwesomeIcon icon="question" />
              }
            </div>
          )}
        </div>

        <div className="buy-buttons">
          <button className="on-card-button" onClick={() => onBuyMaxPack(cardPack)}>
            Buy Max
          </button>
          <button className="on-card-button" onClick={() => onBuyPack(cardPack)}>
            {cardPack.quantity} cards for {formatNumber(cardPack.cost, 0, 0)} gold
          </button>
        </div>
      </div>
    )}
    </div>
  </div>;
}