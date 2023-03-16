import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pick } from 'lodash';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import shallow from 'zustand/shallow';
import { getItemRarity } from '../../gamelogic/card-packs';

import Icon from '../../shared/components/icon';
import { Rarity, Pack, GameFeature, RealizedCardPack, ResourcesMap } from '../../shared/types';
import { formatNumber } from '../../shared/utils';
import useStore from '../../store';
import { SectionHeader } from './common-styles';

interface PackListProps {
  feature: GameFeature,
}

export default function PackList(props: PackListProps) {
  const {packs, buyPack, buyMaxPack}
    = useStore(s => pick(s.cardPacks, ['packs', 'buyPack', 'buyMaxPack']), shallow);
  const discoveredPacks = useStore(s => s.discovery.discoveredCardPacks);
  const discoveredCards = useStore(s => s.discovery.discoveredCards);

  const onBuyPack = useCallback((cardPack: RealizedCardPack) => {
    buyPack(cardPack);
  }, [buyPack]);

  const onBuyMaxPack = useCallback((cardPack: RealizedCardPack) => {
    buyMaxPack(cardPack);
  }, [buyMaxPack]);

  return <Section>
    <SectionHeader>Card Packs</SectionHeader>
    <List>
    {Object.values(packs)
    .filter(pack => discoveredPacks[pack.id] && pack.feature === props.feature)
    .map(pack =>
      <Pack key={pack.id}>
        <PackName>{pack.name}</PackName>

        <PossibleThings>
          {pack.possibleThings.map(({thing, chance}) => {
            const rarity = getItemRarity(chance);
            return <ItemInPack
              discovered={discoveredCards[thing.id]}
              rarity={rarity}
              key={thing.id}
              data-tip={discoveredCards[thing.id] ? thing.name : "Undiscovered " + rarity}
            >
              {discoveredCards[thing.id] ? 
                <Icon size="xs" icon={thing.icon} /> :
                <FontAwesomeIcon icon="question" />
              }
            </ItemInPack>
        })}
        </PossibleThings>

        <BuyButtons>
          <button className="on-card-button" onClick={() => onBuyMaxPack(pack)}>
            Buy Max
          </button>
          <button className="on-card-button" onClick={() => onBuyPack(pack)}>
            {pack.quantity} cards for {getCostText(pack.cost)}
          </button>
        </BuyButtons>
      </Pack>
    )}
    </List>
  </Section>;
}

function getCostText(cost: Partial<ResourcesMap>) {
  return Object.entries(cost)
    .map(([resource, cost]) => formatNumber(cost, 0, 0) + ' ' + resource)
    .join(' and ');
}

const Section = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 350px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
`;

const Pack = styled.div`
  width: 100%;
  min-height: 100px;
  color: white;
  background-color: #555;
  padding: 8px;
`;

const PackName = styled.h3`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: normal;
  margin-top: 0;
`;

const PossibleThings = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  grid-gap: 6px;
  margin-bottom: 10px;
`;

const ItemInPack = styled.div<{discovered: boolean, rarity: Rarity}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333;
  background-color: #444;
  width: 24px;
  height: 40px;
  border-radius: 3px;

  ${props => !props.discovered && css`
    color: #888;
    background-color: #666;
    border: 1px dashed #333;
  `}

  ${props => props.rarity == Rarity.Rare && css`
    border-color: #5db9f0;
    color: #5db9f0;
  `}
  ${props => props.rarity == Rarity.UltraRare && css`
    border-color: rgb(189, 165, 30);
    color: rgb(189, 165, 30);
  `}
`;

const BuyButtons = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 6px;
  align-items: flex-end;
`;