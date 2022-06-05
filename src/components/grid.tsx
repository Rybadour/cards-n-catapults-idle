import classNames from 'classnames';
import { useCallback, useContext, useEffect } from 'react';
import { GridContext } from '../contexts/grid';
import './grid.css';

let lastTime = Date.now();

export default function GridMap() {
  const grid = useContext(GridContext);

  const addCard = useCallback((x: number, y: number) => 
    grid.addCard(x, y),
    [grid]
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
      <div className='total'>{grid.totalGold.toLocaleString()}</div>
      <div className='per-sec'>{grid.goldPerSec.toLocaleString()}/s</div>
    </div>
    <div className='grid-rows'>
    {grid.gridSpaces.map((gridRow, y) => 
      <div className='grid-row'>
        {gridRow.map((card, x) => 
          <div
            className={classNames('grid-space', {card: !!card})}
            onClick={() => addCard(x, y)}
          >
            {card ? card.name : ''}
          </div>
        )}
      </div>
    )}
    </div>
  </div>;
}