import classNames from 'classnames';
import { useCallback, useContext, useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createCard } from '../gamelogic/grid-cards';
import { ProgressBar } from './progress-bar';
import { MarkType, RealizedCard, ResourceType } from '../shared/types';
import { enumFromKey, formatNumber } from '../shared/utils';
import resourceIconMap from '../config/resources';
import { PrestigeContext } from '../contexts/prestige';
import Icon from '../shared/components/icon';
import { SavingLoadingContext } from '../contexts/saving-loading';
import useStore from '../store';

import './grid.scss';

let lastTime = Date.now();

export default function GridMap() {
  const savingLoading = useContext(SavingLoadingContext);
  const prestige = useContext(PrestigeContext);

  const discoveredResources = useStore(s => s.discovery.discoveredResources);
  
  const {resources, useResource} = useStore(s => ({
    resources: s.stats.resources,
    useResource: s.stats.useResource,
  }), shallow);
  
  const gridSpaces = useStore(s => s.grid.gridSpaces);
  const updateGrid = useStore(s => s.grid.update);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      updateGrid(elapsed);
      prestige.update();
      savingLoading.update(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [updateGrid, prestige, savingLoading]);

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
  const returnCardAction = useStore(s => s.grid.returnCard);
  const replaceCardAction = useStore(s => s.grid.replaceCard);

  const takeSelectedCard = useStore(s => s.cards.takeSelectedCard);

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
    {props.card ? <>
      <div className="main-icon">
        <Icon size="lg" icon={props.card?.icon} />
      </div>
      {props.card.isDisabled ? <div className="disabled-slash">
        <FontAwesomeIcon icon="slash" size='3x' />
      </div> : null}
      {props.card.maxDurability ?
        <ProgressBar 
          progress={(props.card.durability ?? 0)/props.card.maxDurability}
          noBorder
          color="#C22"
          height={6}
        /> :
        null
      }
      {props.card.cooldownMs ?
        <ProgressBar
          progress={(props.card.cooldownMs-(props.card.timeLeftMs ?? 0))/props.card.cooldownMs}
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
        <div className="name">{props.card.name}</div>
        <div className="status">
          {props.card.isDisabled ? '(disabled)' : ''}
          {props.card.isExpiredAndReserved ? '(reserved)' : ''}
          {props.card.statusText ? props.card.statusText : ''}
        </div>
        <div className="ability">
          {props.card.totalStrength && props.card.passive ? <>
            <Icon size="sm" icon={resourceIconMap[props.card.passive.resource]} />
            {formatNumber(props.card.totalStrength, 0, 2)}/s
          </> : null }
        </div>
        <div className="ability-cost">
          {props.card.totalCost && props.card.costPerSec ? <>
            <Icon size="sm" icon={resourceIconMap[props.card.costPerSec.resource]} />
            -{formatNumber(props.card.totalCost, 0, 1)}/s
          </> : null }
        </div>
      </div>
    </> : null}
  </div>;
}

function Resource(props: {resource: ResourceType}) {
  const {resources, resourcesPerSec, prestigeEffects} = useStore(s => ({
    resources: s.stats.resources,
    resourcesPerSec: s.stats.resourcesPerSec,
    prestigeEffects: s.stats.prestigeEffects,
  }), shallow);

  const prestigeBonus = (props.resource === ResourceType.Gold ? prestigeEffects.bonuses.goldGain : 1);
  return <div className="resource" data-tip={props.resource}>
    <Icon size="md" icon={resourceIconMap[props.resource]} />
    <div className="amounts">
      <div className='total'>{formatNumber(resources[props.resource], 0, 0)}</div>
      <div className='per-sec'>{formatNumber(resourcesPerSec[props.resource] * prestigeBonus, 0, 1)}/s</div>
    </div>
  </div>;
}