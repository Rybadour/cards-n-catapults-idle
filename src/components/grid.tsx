import classNames from 'classnames';
import { useCallback, useContext, useEffect } from 'react';

import cardsConfig from '../config/cards';
import { CardsContext } from '../contexts/cards';
import { GridContext } from '../contexts/grid';
import { replaceSpaceWithCard } from '../gamelogic/grid-cards';
import { ProgressBar } from './progress-bar';
import { Ability, ResourceType } from '../shared/types';

import './grid.scss';
import { StatsContext } from '../contexts/stats';

let lastTime = Date.now();

export default function GridMap() {
  const stats = useContext(StatsContext);
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);

  const addCard = useCallback((x: number, y: number) => 
    replaceSpaceWithCard(grid, cards, x, y),
    [grid, cards]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      grid.update(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [grid]);

  return <div className='grid'>
    <div className='grid-totals'>
      <img src="icons/two-coins-gold.png" />
      <div className="stats">
        <div className='total'>{stats.resources[ResourceType.Gold].toFixed(0).toLocaleString()}</div>
        <div className='per-sec'>{stats.resourcesPerSec[ResourceType.Gold].toFixed(1).toLocaleString()}/s</div>
      </div>
    </div>
    <div className='grid-rows'>
    {grid.gridSpaces.map((gridRow, y) => 
      <div key={y} className='grid-row'>
        {gridRow.map((card, x) => 
          <div
            key={x}
            className={classNames('grid-space', {card: !!card})}
            onClick={() => addCard(x, y)}
          >
            {card ? <>
              <div className="title">
                <img src={"/icons/" + card?.icon + ".png"} />
                <div>{card ? card.name : ''}</div>
              </div>
              <div className="ability">
                {card.ability == Ability.Produce ? <>
                  <img src="icons/two-coins-gold.png" /> {card.abilityStrength}/s
                </> : null }
                {card.ability == Ability.BonusToMatching ? <>
                  <img src="icons/two-coins-gold.png" /> +{card.abilityStrength * 100}%
                </> : null }
                {card.ability == Ability.ProduceFromMatching ? <>
                  <img src="icons/two-coins-gold.png" /> +{card.abilityStrength}/s
                </> : null }
                {card.ability == Ability.ProduceCard && card.abilityCard ? <>
                  +<img src={"icons/" + cardsConfig[card.abilityCard!!].icon + ".png"} />
                  /{(card.cooldownMs ?? 0)/1000}s
                </> : null }
              </div>
              {card.maxDurability ?
                <ProgressBar progress={(card.durability ?? 0)/card.maxDurability} color="red" /> :
                null
              }
              {card.cooldownMs ?
                <ProgressBar progress={(card.cooldownMs-(card.timeLeftMs ?? 0))/card.cooldownMs} color="#72bcd4" /> :
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