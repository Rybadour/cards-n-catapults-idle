import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { getItemRarity } from '../../gamelogic/card-packs';

import Icon from '../../shared/components/icon';
import { Rarity, Pack, PackItem, RealizedPack } from '../../shared/types';
import { formatNumber } from '../../shared/utils';
import { SectionHeader } from './common-styles';

interface PackListProps<T extends PackItem> {
  itemDescriptor: string;
  packs: RealizedPack<T>[],
  discoveredPacks: Record<string, boolean>,
  discoveredPackItems: Record<string, boolean>,
  buyPack: (pack: RealizedPack<T>) => void,
  buyMaxPack: (pack: RealizedPack<T>) => void,
}

export default function PackList<T extends PackItem>(props: PackListProps<T>) {
  return <Section>
    <SectionHeader>{props.itemDescriptor} Packs</SectionHeader>
    <List>
    {Object.values(props.packs)
    .filter(pack => props.discoveredPacks[pack.id])
    .map(pack =>
      <Pack key={pack.id}>
        <PackName>{pack.name}</PackName>

        <PossibleThings>
          {pack.possibleThings.map(({thing, chance}) => {
            const rarity = getItemRarity(chance);
            return <ItemInPack
              discovered={props.discoveredPackItems[thing.id]}
              rarity={rarity}
              key={thing.id}
              data-tip={props.discoveredPackItems[thing.id] ? thing.name : "Undiscovered " + rarity}
            >
              {props.discoveredPackItems[thing.id] ? 
                <Icon size="xs" icon={thing.icon} /> :
                <FontAwesomeIcon icon="question" />
              }
            </ItemInPack>
        })}
        </PossibleThings>

        <BuyButtons>
          <button className="on-card-button" onClick={() => props.buyMaxPack(pack)}>
            Buy Max
          </button>
          <button className="on-card-button" onClick={() => props.buyPack(pack)}>
            {pack.quantity} cards for {formatNumber(pack.cost, 0, 0)} gold
          </button>
        </BuyButtons>
      </Pack>
    )}
    </List>
  </Section>;
}

const Section = styled.div`
  width: 100%;
  min-width: 240px;
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