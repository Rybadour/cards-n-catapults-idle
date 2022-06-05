import { useContext } from 'react';
import { GridContext } from '../contexts/grid';
import './grid.css';

export default function GridMap() {
  const grid = useContext(GridContext);

  return <div className="grid">
    {grid.gridSpaces.map(gridRow => 
      <div className="grid-row">
        {gridRow.map(card => 
          card ? 
            <div className="card">{card.name}</div> :
            <div className="grid-space"></div>
        )}
      </div>
    )}
  </div>;
}