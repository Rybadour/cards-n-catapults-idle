import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pick } from 'lodash';
import { memo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import shallow from 'zustand/shallow';

import resourceIconMap from '../../config/resources';
import Icon from '../../shared/components/icon';
import { BUILDING_BLUE, FOOD_RED } from '../../shared/constants';
import { CardType, MarkType, RealizedCard } from '../../shared/types';
import { autoFormatNumber, formatNumber } from '../../shared/utils';
import useStore from '../../store';
import { ProgressBar } from './progress-bar';

interface CardGridProps {
  gridId: string,
  cardControlsInjection?: (card: RealizedCard | undefined, x: number, y: number) => ReactJSXElement | undefined
}
export default function CardGrid(props: CardGridProps) {
  const cardGrids = useStore(s => pick(s.cardGrids, [
    'grids', 'clearGrid', 'removeCard', 'replaceCard'
  ]), shallow);
  const [marks, setMarks] = useState<Record<string, MarkType>>({});

  const hoverCard = useCallback((card: RealizedCard | null) => {
    if (card) {
      setMarks(card.cardMarks);
    }
  }, []);

  const leaveCard = useCallback(() => {
    setMarks({});
  }, []);

  const onReplaceCard = useCallback((x: number, y: number, card: RealizedCard) => {
    cardGrids.replaceCard(props.gridId, x, y, card);
  }, [cardGrids.replaceCard, props.gridId]);

  const onReturnCard = useCallback((x: number, y: number) => {
    cardGrids.removeCard(props.gridId, x, y);
  }, [cardGrids.removeCard, props.gridId]);

  return <div>
    <GridRows>
      {cardGrids.grids[props.gridId].map((gridRow, y) => 
        <GridRow key={y}>
          {gridRow.map((card, x) => {
            const key = `${x}:${y}`;
            return <GridTile
              key={key}
              card={card}
              mark={marks[key]}
              onHoverCard={hoverCard}
              onLeaveCard={leaveCard}
              onReplaceCard={onReplaceCard}
              onReturnCard={onReturnCard}
              cardControlsInjection={props.cardControlsInjection}
              x={x} y={y}
            />
          })}
        </GridRow>
      )}
    </GridRows>
  </div>;
}

type GridTileProps = {
  x: number, y: number,
  card: RealizedCard | null,
  mark?: MarkType,
  onHoverCard: (card: RealizedCard | null) => void,
  onLeaveCard: () => void,
  onReplaceCard: (x: number, y: number, card: RealizedCard) => void,
  onReturnCard: (x: number, y: number) => void,
  cardControlsInjection?: (card: RealizedCard | undefined, x: number, y: number) => ReactJSXElement | undefined
};
const GridTile = memo((props: GridTileProps) => {
  const cardDefs = useStore(s => s.cardDefs.defs)
  const cards = useStore(s => pick(s.cards, [
    'cards', 'selectedCard', 'canAffordCard', 'useCard', 'buyCard', 'returnCard'
  ]), shallow);

  const cardDef = props.card ? cardDefs[props.card.cardId] : null;

  const addCard = useCallback(() => {
    if (props.card?.isStatic || !cards.selectedCard) return;

    const tracking = cards.cards[cards.selectedCard];
    let newCard: RealizedCard | null = null;
    if (tracking.numPurchased > 0) {
      newCard = cards.useCard(cards.selectedCard!)
    } else if (cards.canAffordCard(cards.selectedCard!)) {
      newCard = cards.buyCard(cards.selectedCard!)
    }

    if (newCard) {
      newCard.shouldBeReserved = cardDefs[cards.selectedCard].type === CardType.Food;
      props.onReplaceCard(props.x, props.y, newCard);
    }
  }, [props.onReplaceCard, cards, props.card, props.x, props.y]);

  const returnCard = useCallback((evt) => {
    evt.preventDefault();
    if (props.card && !props.card.isStatic) {
      props.onReturnCard(props.x, props.y);
    }
  }, [props.onReturnCard, props.card, props.x, props.y]);
  
  const hoverCard = useCallback(() => { 
    props.onHoverCard(props.card);
  }, [props]);

  const isExpired = !!props.card?.isExpiredAndReserved || !!props.card?.isDisabled;
  return <GridSpace
    isFilled={!!props.card}
    isExpired={isExpired}
    isStatic={props.card?.isStatic ?? false}
    mark={props.mark}
    onClick={addCard}
    onContextMenu={returnCard}
    onMouseEnter={hoverCard}
    onMouseLeave={props.onLeaveCard}
  >
    {props.card && cardDef ? <>
      <CardIcon isExpired={isExpired} isStatic={props.card?.isStatic ?? false}>
        <Icon size="lg" icon={cardDef.icon} />
      </CardIcon>
      {props.card.isDisabled ? <DisabledSlash>
        <FontAwesomeIcon icon="slash" size='3x' />
      </DisabledSlash> : null}
      {cardDef.maxDurability ?
        <ProgressBar 
          progress={(props.card.durability ?? 0)/cardDef.maxDurability}
          noBorder
          color={FOOD_RED}
          height={6}
        /> :
        null
      }
      {cardDef.cooldownMs ?
        <ProgressBar
          progress={(cardDef.cooldownMs-(props.card.timeLeftMs ?? 0))/cardDef.cooldownMs}
          noBorder
          color={BUILDING_BLUE}
          height={6}
        /> :
        null
      }
      <StatusIcon>
        {props.card.statusIcon ?
          <Icon size="xs" icon={props.card.statusIcon} /> :
          null
        }
      </StatusIcon>
      <Details>
        <div className="name">{cardDef.name}</div>
        {props.cardControlsInjection ? props.cardControlsInjection(props.card, props.x, props.y) : null}
        <div className="status">
          {props.card.isDisabled ? '(disabled)' : ''}
          {props.card.isExpiredAndReserved ? '(reserved)' : ''}
          {props.card.statusText ? props.card.statusText : ''}
        </div>
        <AbilityStat>
          {typeof props.card.totalStrength === "number" && cardDef.passive ? <>
            <Icon size="sm" icon={resourceIconMap[cardDef.passive.resource]} />
            {autoFormatNumber(props.card.totalStrength)}/s
          </> : null }
        </AbilityStat>
        <AbilityStat>
          {typeof props.card.totalCost === "number" && cardDef.costPerSec ? <>
            <Icon size="sm" icon={resourceIconMap[cardDef.costPerSec.resource]} />
            -{formatNumber(props.card.totalCost, 0, 1)}/s
          </> : null }
        </AbilityStat>
      </Details>
    </> : null}
  </GridSpace>;
});

const TILE_SIZE = 100;
const GAP = 10;
export const GRID_SIZE = TILE_SIZE + GAP * 2;

const GridRows = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: ${GAP}px;
`;

const GridRow = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: ${GAP}px;
  width: 100%;
  height: ${TILE_SIZE}px;
`;

const Details = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-gap: 6px;
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
`;

interface GridSpaceProps {
  isFilled: boolean,
  isExpired: boolean,
  isStatic: boolean,
  mark?: MarkType,
}
const GridSpace = styled.div<GridSpaceProps>`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-gap: 6px;

  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
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

  ${props => props.isStatic && css`
    background: none;
  `}

  ${props => props.mark == MarkType.Associated && css`
    box-shadow: rgb(104, 156, 228) 0px 0px 4px 2px;
  `};

  ${props => props.mark == MarkType.Buff && css`
    box-shadow: rgba(76, 197, 76, 1) 0px 0px 4px 2px;
  `};

  ${props => props.mark == MarkType.Exclusion && css`
    box-shadow: rgba(255, 0, 0, 1) 0px 0px 4px 2px;
  `};

  &:hover ${Details} {
    display: flex;
  }
`;

const CardIcon = styled.div<{isExpired: boolean, isStatic: boolean}>`
  filter: drop-shadow(1px 1px 6px black);
  ${props => props.isStatic && css`
    filter: opacity(0.75);
  `}

  ${props => props.isExpired && css`
    filter: opacity(0.5);
  `}
`;

const DisabledSlash = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(200, 0, 0, 0.75);
`;

const StatusIcon = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  filter: drop-shadow(1px 1px 6px black);
`;

const AbilityStat = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 3px;
`;