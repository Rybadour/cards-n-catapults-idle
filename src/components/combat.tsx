import { pick } from 'lodash';
import { useCallback } from 'react';

import combatEncounters from '../config/combat-encounters';
import useStore from '../store';
import { ActiveCombatant } from '../store/combat';
import './combat.scss';

export function CombatScene() {
  const combat = useStore(s => pick(
    s.combat, ['selectedEncounter', 'chooseEncounter']
  ));

  return <div className="combat-scene">
    {combat.selectedEncounter ? <Encounter /> : <Map />}
  </div>
}

function Map() {
  const combat = useStore(s => pick(
    s.combat, ['chooseEncounter']
  ));

  const chooseEncounter = useCallback((encounter) => {
    combat.chooseEncounter(encounter);
  }, [combat.chooseEncounter]);

  return <div className="map">
    <h2>Encounters</h2>
    <p>Choose an encounter to test your mettle!</p>

    {Object.values(combatEncounters).map(ce =>
      <button key={ce.id} className="encounter on-card-button" onClick={() => chooseEncounter(ce)}>
        <strong className="name">{ce.name}</strong>
        <p className="description">{ce.description}</p>
      </button>
    )}
  </div>;
}

function Encounter() {
  const combat = useStore(s => pick(
    s.combat, ['selectedEncounter', 'enemyGrid', 'playerGrid', 'chooseEncounter']
  ));

  return <div className="active-encounter">
    <h2>Fighting {combat.selectedEncounter?.name}</h2>

    <div className='grid-rows'>
    {combat.enemyGrid.map((gridRow, y) => 
      <div key={y} className='grid-row'>
        {gridRow.map((combatant, x) =>
          <EncounterTile
            key={`${x}:${y}`}
            combatant={combatant}
            x={x} y={y}
          />
        )}
      </div>
    )}
    </div>

    <h2>Your Army</h2>

    <div className='grid-rows'>
    {combat.playerGrid.map((gridRow, y) => 
      <div key={y} className='grid-row'>
        {gridRow.map((combatant, x) =>
          <EncounterTile
            key={`${x}:${y}`}
            combatant={combatant}
            x={x} y={y}
          />
        )}
      </div>
    )}
    </div>
  </div>
}

function EncounterTile(props: {combatant: ActiveCombatant | null, x: number, y: number}) {
  return <div className="encounter-tile">
    <strong>{props.combatant?.health ?? 'Empty'}</strong>
  </div>
}