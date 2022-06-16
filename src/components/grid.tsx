import classNames from 'classnames';
import { useCallback, useContext, useEffect } from 'react';

import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import { GridContext } from '../contexts/grid';
import { replaceSpaceWithCard } from '../gamelogic/grid-cards';
import { ProgressBar } from './progress-bar';
import { Ability, RealizedCard, ResourceType } from '../shared/types';

import './grid.scss';
import { StatsContext } from '../contexts/stats';
import { enumFromKey, formatNumber } from '../shared/utils';
import resourceIconMap from '../config/resources';

let lastTime = Date.now();

export default function GridMap() {
  const stats = useContext(StatsContext);
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);

  const addCard = useCallback((x: number, y: number) => 
    replaceSpaceWithCard(grid, cards, x, y),
    [grid, cards]
  );

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

  return <div className='grid'>
    <div className='resources'>
      {Object.keys(stats.resources).map(resource =>
        <Resource
          key={resource}
          resource={enumFromKey(ResourceType, resource)}
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
            className={classNames('grid-space', {card: !!card})}
            onClick={() => addCard(x, y)}
            onContextMenu={(evt) => returnCard(evt, x, y, card)}
          >
            {card ? <>
              <div className="title">
                <img src={"icons/" + card?.icon + ".png"} />
                <div>{card ? card.name : ''}</div>
              </div>
              <div className="ability">
                {card.ability == Ability.Produce && card.abilityResource ? <>
                  <img src={"icons/" + resourceIconMap[card.abilityResource]} /> {card.abilityStrength}/s
                </> : null }
                {card.ability == Ability.BonusToMatching ? <>
                  +{formatNumber(card.abilityStrength * 100, 0, 0)}%
                </> : null }
                {card.ability == Ability.ProduceFromMatching && card.abilityResource ? <>
                  <img src={"icons/" + resourceIconMap[card.abilityResource]} /> +{formatNumber(card.abilityStrength, 0, 2)}/s
                </> : null }
                {card.ability == Ability.ProduceCard && card.abilityCard ? <>
                  +<img src={"icons/" + cardsConfig[card.abilityCard!!].icon + ".png"} />
                  /{(card.cooldownMs ?? 0)/1000}s
                </> : null }
              </div>
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
            </> : null}
          </div>
        )}
      </div>
    )}
    </div>
  </div>;
}

function Resource(props: {resource: ResourceType | undefined, stats: StatsContext}) {
  if (!props.resource) return null;

  return <div className="resource">
    <img src={"icons/" + resourceIconMap[props.resource]} />
    <div className="amounts">
      <div className='total'>{formatNumber(props.stats.resources[props.resource], 0, 0)}</div>
      <div className='per-sec'>{formatNumber(props.stats.resourcesPerSec[props.resource], 0, 1)}/s</div>
    </div>
  </div>;
}