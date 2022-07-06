import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext } from 'react';
import { CardPacksContext } from '../contexts/card-packs';
import { DiscoveryContext } from '../contexts/discovery';
import { RealizedCardPack } from '../shared/types';
import { formatNumber } from '../shared/utils';
import './card-packs.scss';

export default function CardPacks() {
  const cardPacks = useContext(CardPacksContext);
  const discovery = useContext(DiscoveryContext);

  const onBuyPack = useCallback((cardPack: RealizedCardPack) => {
    cardPacks.buyPack(cardPack);
  }, [cardPacks]);

  return <div className="card-packs">
    <h4>Card Packs</h4>
    <div className="card-pack-list">
    {Object.values(cardPacks.cardPacks).map(cardPack =>
      <div
        key={cardPack.id}
        className="card-pack"
      >
        <div className="name">{cardPack.name}</div>

        <div className="cards">
          {cardPack.possibleCards.map(({card}) => 
            <div className="possible-card" key={card.id}>
              {discovery.discoveredCards[card.id] ? 
                <img src={"icons/" + card.icon + ".png"} /> :
                <FontAwesomeIcon icon="question" />
              }
            </div>
          )}
        </div>

        <button className="purchase-button" onClick={() => onBuyPack(cardPack)}>
          Purchase for {formatNumber(cardPack.cost, 0, 0)} gold
        </button>
      </div>
    )}
    </div>
  </div>;
}