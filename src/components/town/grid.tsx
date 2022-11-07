import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ProgressBar } from '../shared/progress-bar';
import { MarkType, RealizedCard, ResourceType } from '../../shared/types';
import { autoFormatNumber, enumFromKey, formatNumber } from '../../shared/utils';
import resourceIconMap from '../../config/resources';
import Icon from '../../shared/components/icon';
import useStore from '../../store';

import './grid.scss';

let lastTime = Date.now();

export default function GridMap() {
  const updateSaving = useStore(s => s.savingLoading.update);
  const updatePrestige = useStore(s => s.prestige.update);

  const discoveredResources = useStore(s => s.discovery.discoveredResources);
  
  const resources = useStore(s => s.stats.resources);
  
  const gridSpaces = useStore(s => s.townGrid.gridSpaces);
  const updateGrid = useStore(s => s.townGrid.update);
  const clearGrid = useStore(s => s.townGrid.clearGrid);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      updateGrid(elapsed);
      updatePrestige();
      updateSaving(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [updateGrid, updatePrestige, updateSaving]);

  const [marks, setMarks] = useState<Record<string, MarkType>>({});

  const hoverCard = useCallback((card: RealizedCard | null) => {
    if (card) {
      setMarks(card.cardMarks);
    }
  }, []);

  const leaveCard = useCallback(() => {
    setMarks({});
  }, []);

  return <div className='grid'>
    <div className='resources'>
      {Object.keys(resources)
      .map(res => enumFromKey(ResourceType, res))
      .filter(resource => resource && discoveredResources[resource])
      .map(resource =>
        <Resource
          key={resource}
          resource={resource!}
        />
      )}
    </div>
    <div className='grid-controls'>
      <button
        className='secondary-button'
        data-tip="Returns all cards to your inventory."
        onClick={clearGrid}
      >Clear Grid</button>
    </div>
    <div className='grid-rows'>
    {gridSpaces.map((gridRow, y) => 
      <div key={y} className='grid-row'>
        {gridRow.map((card, x) =>
          <GridTile
            key={`${x}:${y}`}
            card={card}
            x={x} y={y}
            mark={marks[`${x}:${y}`]}
            onHoverCard={hoverCard}
            onLeaveCard={leaveCard}
          />
        )}
      </div>
    )}
    </div>
  </div>;
}

type GridTileProps = {
  x: number, y: number,
  card: RealizedCard | null,
  mark: MarkType,
  onHoverCard: (card: RealizedCard | null) => void,
  onLeaveCard: () => void,
};
function GridTile(props: GridTileProps) {
  const cardDefs = useStore(s => s.cardDefs.defs)
  const returnCardAction = useStore(s => s.townGrid.returnCard);
  const replaceCardAction = useStore(s => s.townGrid.replaceCard);
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

  return <div
    key={props.x}
    className={classNames('grid-space', {
      card: !!props.card,
      expired: props.card?.isExpiredAndReserved || props.card?.isDisabled,
      'marked-exclusion': props.mark == MarkType.Exclusion,
      'marked-buff': props.mark == MarkType.Buff,
      'marked-associated': props.mark == MarkType.Associated,
    })}
    onClick={addCard}
    onContextMenu={returnCard}
    onMouseEnter={hoverCard}
    onMouseLeave={props.onLeaveCard}
  >
    {props.card && cardDef ? <>
      <div className="main-icon">
        <Icon size="lg" icon={cardDef.icon} />
      </div>
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
  </div>;
}

function Resource(props: {resource: ResourceType}) {
  const {resources, resourcesPerSec} = useStore(s => ({
    resources: s.stats.resources,
    resourcesPerSec: s.stats.resourcesPerSec,
  }), shallow);

  return <div className="resource" data-tip={props.resource}>
    <Icon size="md" icon={resourceIconMap[props.resource]} />
    <div className="amounts">
      <div className='total'>{formatNumber(resources[props.resource], 0, 0)}</div>
      <div className='per-sec'>{formatNumber(resourcesPerSec[props.resource], 0, 1)}/s</div>
    </div>
  </div>;
}