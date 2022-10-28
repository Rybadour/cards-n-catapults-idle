import styled from 'styled-components';

import { ActiveCombatant, ActiveCombatGrid } from '../../store/combat';

export default function ArmyGrid(props: {grid: ActiveCombatGrid}) {
  return <GridRows>
    {props.grid.map((gridRow, y) => 
      <GridRow key={y}>
        {gridRow.map((combatant, x) =>
          <ArmyTile
            key={`${x}:${y}`}
            combatant={combatant}
            x={x} y={y}
          />
        )}
      </GridRow>
    )}
  </GridRows>;
}

function ArmyTile(props: {combatant: ActiveCombatant | null, x: number, y: number}) {
  return (props.combatant ?
    <FilledTile>
      <strong>{props.combatant.health}</strong>
    </FilledTile> :
    <EmptyTile></EmptyTile>
  )
}

const gridMargin = '10px';
export const GridRows = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
  margin: ${gridMargin};
`;

const cardWidth = '100px';
const cardHeight = '100px';
export const GridRow = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 10px;
  width: 100%;
  height: ${cardHeight};
`;

export const EmptyTile = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-gap: 6px;

  width: ${cardWidth};
  height: ${cardHeight};
  background-color: #666;
  color: white;
  border-radius: 5px;
  padding: 3px;
  position: relative;
`;

export const FilledTile = styled(EmptyTile)`
  background-color: #888;
`;

/* *
.active-encounter {
  .encounter-tile {

    .main-icon {
      filter: drop-shadow(1px 1px 6px black);
    }

    .progress {
      height: 10px;
    }

    .details {
      display: none;
    }
    
    .status-icon {
      position: absolute;
      bottom: 6px;
      right: 6px;
      filter: drop-shadow(1px 1px 6px black);
    }

    &:hover .details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      grid-gap: 8px;
      width: 100%;
      height: 100%;
      background-color: rgba(100, 100, 100, 0.9);
      border-radius: 5px;
      position: absolute;
      top: 0;
      left: 0;
      font-weight: bold;
      padding: 4px;
      text-align: center;

      .ability, .ability-cost {
        display: flex;
        align-items: center;
        grid-gap: 3px;
      }
    }

    &.card {
      background-color: #888;
    }
  }
}
/* */