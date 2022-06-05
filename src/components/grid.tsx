import classNames from 'classnames';
import { useContext } from 'react';
import { GridContext } from '../contexts/grid';
import './grid.css';

export default function GridMap() {
  const grid = useContext(GridContext);

  return <div className='grid'>
    {grid.gridSpaces.map((gridRow, y) => 
      <div className='grid-row'>
        {gridRow.map((card, x) => 
          <div
            className={classNames('grid-space', {card: !!card})}
            onClick={() => grid.addCard(x, y)}
          >
            {card ? card.name : ''}
          </div>
        )}
      </div>
    )}
  </div>;
}