import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import { CardPacksContext } from '../contexts/card-packs';
import { DiscoveryContext } from '../contexts/discovery';
import { Rarity, RealizedCardPack } from '../shared/types';
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
    {Object.values(cardPacks.cardPacks)
    .filter(pack => discovery.discoveredCardPacks[pack.id])
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
                discovered: discovery.discoveredCards[card.id],
                'ultra-rare': card.rarity == Rarity.UltraRare,
              })}
              key={card.id}
              data-tip={discovery.discoveredCards[card.id] ? card.name : "Undiscovered " + card.rarity}
            >
              {discovery.discoveredCards[card.id] ? 
                <img src={"icons/" + card.icon + ".png"} /> :
                <FontAwesomeIcon icon="question" />
              }
            </div>
          )}
        </div>

        <button className="purchase-button on-card-button" onClick={() => onBuyPack(cardPack)}>
          Purchase {cardPack.quantity} cards for {formatNumber(cardPack.cost, 0, 0)} gold
        </button>
      </div>
    )}
    </div>
  </div>;
}