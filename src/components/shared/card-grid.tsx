import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';

import resourceIconMap from '../../config/resources';
import Icon from '../../shared/components/icon';
import { Grid, MarkType, RealizedCard } from '../../shared/types';
import { autoFormatNumber, formatNumber } from '../../shared/utils';
import useStore from '../../store';
import { ProgressBar } from './progress-bar';

export default function CardGrid(props: {grid: Grid}) {
  return <GridRows>
    {props.grid.map((gridRow, y) => 
      <GridRow key={y}>
        {gridRow.map((card, x) =>
          <GridTile
            key={`${x}:${y}`}
            card={card}
            mark={undefined}
            onHoverCard={(card) => {console.log('noop')}}
            onLeaveCard={() => {console.log('noop')}}
            x={x} y={y}
          />
        )}
      </GridRow>
    )}
  </GridRows>;
}

type GridTileProps = {
  x: number, y: number,
  card: RealizedCard | null,
  mark?: MarkType,
  onHoverCard: (card: RealizedCard | null) => void,
  onLeaveCard: () => void,
};
function GridTile(props: GridTileProps) {
  const cardDefs = useStore(s => s.cardDefs.defs)
  const returnCardAction = useStore(s => s.grid.returnCard);
  const replaceCardAction = useStore(s => s.grid.replaceCard);
  const takeSelectedCard = useStore(s => s.cards.takeSelectedCard);

  const cardDef = props.card ? cardDefs[props.card.cardId] : null;

  const addCard = useCallback(() => {
    const newCard = takeSelectedCard();
    if (newCard) {
      newCard.shouldBeReserved = true;
      replaceCardAction(props.x, props.y, newCard);
    }
  }, [replaceCardAction, takeSelectedCard, props]);

  const returnCard = useCallback((evt) => {
    evt.preventDefault();
    if (props.card) {
      returnCardAction(props.x, props.y);
    }
  }, [returnCardAction, props]);
  
  const hoverCard = useCallback(() => { 
    props.onHoverCard(props.card);
  }, [props]);

  const isExpired = !!props.card?.isExpiredAndReserved || !!props.card?.isDisabled;
  return <GridSpace
    isFilled={!!props.card}
    isExpired={isExpired}
    mark={props.mark}
    onClick={addCard}
    onContextMenu={returnCard}
    onMouseEnter={hoverCard}
    onMouseLeave={props.onLeaveCard}
  >
    {props.card && cardDef ? <>
      <CardIcon isExpired={isExpired}>
        <Icon size="lg" icon={cardDef.icon} />
      </CardIcon>
      {props.card.isDisabled ? <div className="disabled-slash">
        <FontAwesomeIcon icon="slash" size='3x' />
      </div> : null}
      {cardDef.maxDurability ?
        <ProgressBar 
          progress={(props.card.durability ?? 0)/cardDef.maxDurability}
          noBorder
          color="#C22"
          height={6}
        /> :
        null
      }
      {cardDef.cooldownMs ?
        <ProgressBar
          progress={(cardDef.cooldownMs-(props.card.timeLeftMs ?? 0))/cardDef.cooldownMs}
          noBorder
          color="#72bcd4"
          height={6}
        /> :
        null
      }
      <div className="status-icon">
        {props.card.statusIcon ?
          <Icon size="xs" icon={props.card.statusIcon} /> :
          null
        }
      </div>
      <div className="details">
        <div className="name">{cardDef.name}</div>
        <div className="status">
          {props.card.isDisabled ? '(disabled)' : ''}
          {props.card.isExpiredAndReserved ? '(reserved)' : ''}
          {props.card.statusText ? props.card.statusText : ''}
        </div>
        <div className="ability">
          {props.card.totalStrength && cardDef.passive ? <>
            <Icon size="sm" icon={resourceIconMap[cardDef.passive.resource]} />
            {autoFormatNumber(props.card.totalStrength)}/s
          </> : null }
        </div>
        <div className="ability-cost">
          {props.card.totalCost && cardDef.costPerSec ? <>
            <Icon size="sm" icon={resourceIconMap[cardDef.costPerSec.resource]} />
            -{formatNumber(props.card.totalCost, 0, 1)}/s
          </> : null }
        </div>
      </div>
    </> : null}
  </GridSpace>;
}

const gridMargin = '10px';
const GridRows = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
  margin: ${gridMargin};
`;

const cardWidth = '100px';
const cardHeight = '100px';
const GridRow = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 10px;
  width: 100%;
  height: ${cardHeight};
`;

interface GridSpaceProps {
  isFilled: boolean,
  isExpired: boolean,
  mark?: MarkType,
}
const GridSpace = styled.div<GridSpaceProps>`
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

  ${props => !props.isFilled && css`
    background-color: #888;
  `}

  ${props => !props.isExpired && css`
    background-color: #666;
  `}
`;

const CardIcon = styled.div<{isExpired: boolean}>`
  ${props => !props.isExpired && css`
    filter: opacity(0.5);
  `}
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

  }
}
/* */