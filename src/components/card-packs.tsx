import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import { CardPacksContext } from '../contexts/card-packs';
import { DiscoveryContext } from '../contexts/discovery';
import { StatsContext } from '../contexts/stats';
import Icon from '../shared/components/icon';
import { Rarity, RealizedCardPack } from '../shared/types';
import { formatNumber, getExpValueMultiple, getMultipleFromExpValue } from '../shared/utils';
import './card-packs.scss';

export default function CardPacks() {
  const cardPacks = useContext(CardPacksContext);
  const stats = useContext(StatsContext);
  const discovery = useContext(DiscoveryContext);

  const onBuyPack = useCallback((cardPack: RealizedCardPack) => {
    cardPacks.buyPack(cardPack);
  }, [cardPacks, stats]);

  const onBuyMaxPack = useCallback((cardPack: RealizedCardPack) => {
    cardPacks.buyMaxPack(cardPack);
  }, [cardPacks, stats]);

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
                'rare': card.rarity == Rarity.Rare,
                'ultra-rare': card.rarity == Rarity.UltraRare,
              })}
              key={card.id}
              data-tip={discovery.discoveredCards[card.id] ? card.name : "Undiscovered " + card.rarity}
            >
              {discovery.discoveredCards[card.id] ? 
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