import { pick } from 'lodash';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import ActiveEncounter from './active-encounter';
import EncounterList from './encounter-list';
import RewardsPage from './rewards-page';

export function CombatScene() {
  const combat = useStore(s => pick(
    s.combat, ['encounter', 'showRewardPage']
  ), shallow);

  return <Scene>
    {combat.encounter ? 
      (combat.showRewardPage ? 
        <RewardsPage /> :
        <ActiveEncounter />
      ):
      <EncounterList />
    }
  </Scene>
}

const Scene = styled.div`
  color: white;
  width: 100%;
`;