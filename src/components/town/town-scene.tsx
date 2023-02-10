import styled from "styled-components";

import PackList from "../shared/pack-list";
import CardList from './card-list';
import { CardType, GameFeature, RealizedCard, ResourceType } from "../../shared/types";
import CardGrid from "../shared/card-grid";
import { Resources } from "../shared/resources";
import Icon from "../../shared/components/icon";
import useStore from "../../store";
import { pick } from "lodash";
import shallow from "zustand/shallow";
import { useCallback } from "react";
import { getGridDistance } from "../../gamelogic/grid";

export default function TownScene() {
  const stats = useStore(s => pick(s.stats, [
    'canAfford', 'useResource'
  ]), shallow);
  const cardGrids = useStore(s => pick(s.cardGrids, [
    'removeCard'   
  ]), shallow);

  const startClearingForest = useCallback((cost: number, x: number, y: number) => {
    if (stats.canAfford({[ResourceType.Gold]: cost})) {
      stats.useResource(ResourceType.Gold, cost);
      cardGrids.removeCard('town', x, y, false);
    }
  }, [stats.canAfford, stats.useResource, cardGrids.removeCard]);

  return <>
    <SideSection>
      <PackList feature={GameFeature.Economy} />
    </SideSection>
    <MiddleSection>
      <Resources />
      <CardGrid
        gridId="town"
        cardControlsInjection={(card, x, y) => {
          const distanceFromCenter = getGridDistance({x, y}, {x: 2, y: 2});
          const cost = 50 * Math.pow(10,  (distanceFromCenter - 1));
          if (card?.cardId === 'forest') {
            return <ClearForestButton data-tip="Clear Forest" onClick={() => startClearingForest(cost, x, y)}>
              <ClearForestIcon>
                <Icon icon="logging" size="xs" />
              </ClearForestIcon>
              {cost} gold
            </ClearForestButton>;
          }
        }}
      />
    </MiddleSection>
    <SideSection>
      <CardList allowedCards={{
        [CardType.Building]: true,
        [CardType.Food]: true,
        [CardType.Person]: true,
        [CardType.Resource]: true, 
        [CardType.Treasure]: true,
        [CardType.Enemy]: false,
        [CardType.Soldier]: false,
      }} />
    </SideSection>
  </>;
}

const SideSection = styled.div`
  margin-top: 50px;
`;

const MiddleSection = styled.div`
  margin: 20px 30px 0;
`;

const ClearForestButton = styled.button`
  background-color: #333;
  outline: none;
  border: none;
  border-radius: 2px;
  color: white;
  display: flex;
  flex-direction: row;
  gap: 4px;
  padding: 4px 6px;
`;

const ClearForestIcon = styled.div`
`;