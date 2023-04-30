import styled from "styled-components";
import { pick } from "lodash";
import shallow from "zustand/shallow";
import { useCallback } from "react";

import CardList from './card-list';
import { CardType, ResourceType } from "../../shared/types";
import CardGrid, { GRID_SIZE } from "../shared/card-grid";
import { Resources } from "../shared/resources";
import Icon from "../../shared/components/icon";
import useStore from "../../store";
import { getGridDistance } from "../../gamelogic/grid";
import { ScrollableContainer } from "../shared/scrollable-container";
import { GridControls } from "../shared/grid-controls";
import global from "../../config/global";

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

  const defaultCenter = {...global.startingTown.center};
  defaultCenter.x *= -1 * GRID_SIZE;
  defaultCenter.y *= -1 * GRID_SIZE;

  return <>
    <SideSection>
    </SideSection>
    <MiddleSection>
      <Resources />
      <GridControls gridId="town" />
      <ScrollableContainer defaultCenter={defaultCenter}>
        <CardGrid
          gridId="town"
          cardControlsInjection={(card, x, y) => {
            const distanceFromCenter = getGridDistance({x, y}, global.startingTown.center);
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
      </ScrollableContainer>
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
  margin: 20px 30px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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