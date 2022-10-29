import { pick } from 'lodash';
import shallow from 'zustand/shallow';

import useStore from '../../store';
import ArmyGrid from './army-grid';

export default function ActiveEncounter() {
  const combat = useStore(s => pick(
    s.combat, ['selectedEncounter', 'enemyGrid', 'playerGrid', 'chooseEncounter']
  ), shallow);

  return <div className="active-encounter">
    <h2>Fighting {combat.selectedEncounter?.name}</h2>
    <ArmyGrid grid={combat.enemyGrid} />

    <h2>Your Army</h2>
    <ArmyGrid grid={combat.playerGrid} />
  </div>;
}