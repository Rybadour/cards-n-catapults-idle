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

let lastTime = Date.now();

export default function GridMap() {
  const discovery = useContext(DiscoveryContext);
  const prestige = useContext(PrestigeContext);
  const stats = useContext(StatsContext);
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);

  const addCard = useCallback((x: number, y: number) => {
    if (cards.selectedCard == null || !cards.hasCard(cards.selectedCard)) {
      return;
    }

    const quantity = cards.cards[cards.selectedCard.id]; 
    const oldCard = grid.replaceCard(x, y, createCard(cards.selectedCard, quantity, prestige.prestigeEffects));
    cards.replaceCard(oldCard);
  }, [grid, cards]);

  const returnCard = useCallback((evt, x: number, y: number, card: RealizedCard | null) => {
    evt.preventDefault();
    if (card) {
      grid.returnCard(x, y);
      cards.returnCard(card);
    }
  }, [cards]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      grid.update(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [grid]);


  const [marks, setMarks] = useState<Record<string, MarkType>>({});

  const hoverCard = useCallback((card: RealizedCard | null) => {
    if (card) {
      setMarks(card.cardMarks);
    }
  }, []);

  return <div className='grid'>
    <div className='resources'>
      {Object.keys(stats.resources)
      .map(res => enumFromKey(ResourceType, res))
      .filter(resource => resource)
      .filter(resource => discovery.discoveredResources[resource!!])
      .map(resource =>
        <Resource
          key={resource}
          resource={resource!!}
          stats={stats}
        />
      )}
    </div>
    <div className='grid-rows'>
    {grid.gridSpaces.map((gridRow, y) => 
      <div key={y} className='grid-row'>
        {gridRow.map((card, x) => 
          <div
            key={x}
            className={classNames('grid-space', {
              card: !!card,
              expired: card?.isExpiredAndReserved || card?.isDisabled,
              'marked-exclusion': marks[`${x}:${y}`] == MarkType.Exclusion,
              'marked-buff': marks[`${x}:${y}`] == MarkType.Buff,
            })}
            onClick={() => addCard(x, y)}
            onContextMenu={(evt) => returnCard(evt, x, y, card)}
            onMouseEnter={() => hoverCard(card)}
            onMouseLeave={() => setMarks({})}
          >
            {card ? <>
              <img src={"icons/" + card?.icon + ".png"} className="main-icon" />
              {card.isDisabled ? <div className="disabled-slash">
                <FontAwesomeIcon icon="slash" size='3x' />
              </div> : null}
              {card.maxDurability ?
                <ProgressBar 
                  progress={(card.durability ?? 0)/card.maxDurability}
                  noBorder
                  color="#C22"
                  height={6}
                /> :
                null
              }
              {card.cooldownMs ?
                <ProgressBar
                  progress={(card.cooldownMs-(card.timeLeftMs ?? 0))/card.cooldownMs}
                  noBorder
                  color="#72bcd4"
                  height={6}
                /> :
                null
              }
              <div className="details">
                <div className="name">{card.name}</div>
                <div className="status">
                  {card.isDisabled ? '(disabled)' : ''}
                  {card.isExpiredAndReserved ? '(expired)' : ''}
                </div>
                <div className="ability">
                  {card.totalStrength && card.abilityResource ? <>
                    <img src={"icons/" + resourceIconMap[card.abilityResource]} />
                    {formatNumber(card.totalStrength, 0, 2)}/s
                  </> : null }
                </div>
                <div className="ability-cost">
                  {card.totalCost && card.abilityCostPerSec ? <>
                    <img src={"icons/" + resourceIconMap[card.abilityCostPerSec.resource]} />
                    -{formatNumber(card.totalCost, 0, 1)}/s
                  </> : null }
                </div>
              </div>
            </> : null}
          </div>
        )}
      </div>
    )}
    </div>
  </div>;
}

function Resource(props: {resource: ResourceType, stats: StatsContext}) {
  return <div className="resource" data-tip={props.resource}>
    <img src={"icons/" + resourceIconMap[props.resource]} />
    <div className="amounts">
      <div className='total'>{formatNumber(props.stats.resources[props.resource], 0, 0)}</div>
      <div className='per-sec'>{formatNumber(props.stats.resourcesPerSec[props.resource], 0, 1)}/s</div>
    </div>
  </div>;
}