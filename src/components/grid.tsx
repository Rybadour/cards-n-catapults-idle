import classNames from 'classnames';
import { useCallback, useContext, useEffect } from 'react';
import { CardsContext } from '../contexts/cards';
import { GridContext } from '../contexts/grid';
import { replaceSpaceWithCard } from '../gamelogic/grid-cards';
import './grid.css';
import { ProgressBar } from './progress-bar';

let lastTime = Date.now();

export default function GridMap() {
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
      <div className='total'>{grid.totalGold.toFixed(0).toLocaleString()}</div>
      <div className='per-sec'>{grid.goldPerSec.toFixed(1).toLocaleString()}/s</div>
    </div>
    <div className='grid-rows'>
    {grid.gridSpaces.map((gridRow, y) => 
      <div className='grid-row'>
        {gridRow.map((card, x) => 
          <div
            className={classNames('grid-space', {card: !!card})}
            onClick={() => addCard(x, y)}
          >
            {card ? <>
              <img src={"/icons/" + card?.icon + ".png"} />
              <div>{card ? card.name : ''}</div>
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