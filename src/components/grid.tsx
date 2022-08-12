import classNames from 'classnames';
import { useCallback, useContext, useEffect, useState } from 'react';

import { CardsContext } from '../contexts/cards';
import { GridContext } from '../contexts/grid';
import { createCard } from '../gamelogic/grid-cards';
import { ProgressBar } from './progress-bar';
import { MarkType, RealizedCard, ResourceType } from '../shared/types';

import './grid.scss';
import { StatsContext } from '../contexts/stats';
import { enumFromKey, formatNumber } from '../shared/utils';
import resourceIconMap from '../config/resources';
import { DiscoveryContext } from '../contexts/discovery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PrestigeContext } from '../contexts/prestige';
import Icon from '../shared/components/icon';
import { SavingLoadingContext } from '../contexts/saving-loading';

let lastTime = Date.now();

export default function GridMap() {
  const discovery = useContext(DiscoveryContext);
  const savingLoading = useContext(SavingLoadingContext);
  const prestige = useContext(PrestigeContext);
  const stats = useContext(StatsContext);
  const grid = useContext(GridContext);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      grid.update(elapsed);
      prestige.update();
      savingLoading.update(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [grid, stats, prestige, savingLoading]);

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
      {Object.keys(stats.resources)
      .map(res => enumFromKey(ResourceType, res))
      .filter(resource => resource && discovery.discoveredResources[resource])
      .map(resource =>
        <Resource
          key={resource}
          resource={resource!}
          stats={stats}
        />
      )}
    </div>
    <div className='grid-rows'>
    {grid.gridSpaces.map((gridRow, y) => 
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
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);

  const addCard = useCallback(() => {
    if (cards.selectedCard == null || !cards.hasCard(cards.selectedCard)) {
      return;
    }

    const quantity = cards.cards[cards.selectedCard.id]; 
    const newCard = createCard(cards.selectedCard, quantity);
    newCard.shouldBeReserved = true;
    const oldCard = grid.replaceCard(props.x, props.y, newCard);
    cards.replaceCard(oldCard);
  }, [grid, cards, props]);

  const returnCard = useCallback((evt) => {
    evt.preventDefault();
    if (props.card) {
      grid.returnCard(props.x, props.y);
      cards.returnCard(props.card);
    }
  }, [grid, cards, props]);
  
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

function Resource(props: {resource: ResourceType, stats: StatsContext}) {
  const prestigeBonus = (props.resource === ResourceType.Gold ? props.stats.prestigeEffects.bonuses.goldGain : 1);
  return <div className="resource" data-tip={props.resource}>
    <Icon size="md" icon={resourceIconMap[props.resource]} />
    <div className="amounts">
      <div className='total'>{formatNumber(props.stats.resources[props.resource], 0, 0)}</div>
      <div className='per-sec'>{formatNumber(props.stats.resourcesPerSec[props.resource] * prestigeBonus, 0, 1)}/s</div>
    </div>
  </div>;
}