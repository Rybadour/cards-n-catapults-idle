import { pick } from 'lodash';
import styled from 'styled-components';
import { useCallback } from 'react';

import combatEncounters from '../../config/combat-encounters';
import useStore from '../../store';
import { CombatEncounter } from '../../shared/types';

export default function EncounterList() {
  const combat = useStore(s => pick(
    s.combat, ['chooseEncounter', 'completedEncounters']
  ));

  function isEncounterLocked(ce: CombatEncounter) {
    return ce.unlockedBy === '' ? false : !combat.completedEncounters.includes(ce.unlockedBy);
  }
  function isEncounterComplete(ce: CombatEncounter) {
    return combat.completedEncounters.includes(ce.id);
  }

  const chooseEncounter = useCallback((encounter) => {
    if (isEncounterLocked(encounter) || isEncounterComplete(encounter)) return;

    combat.chooseEncounter(encounter);
  }, [combat.chooseEncounter]);

  return <Page>
    <InnerPage>
      <h2>Encounters</h2>
      <p>Choose an encounter to test your mettle!</p>

      <List>
        {Object.values(combatEncounters).map(ce => {
          const isCompleted = isEncounterComplete(ce);
          const isLocked = isEncounterLocked(ce);
          return <EncounterButton key={ce.id} className="encounter" onClick={() => chooseEncounter(ce)}>
            <strong className="name">{ce.name}</strong>
            {isCompleted ? <>
              <p>Completed!</p>
            </> : null}
            {isLocked ? <>
              <p>Locked</p>
            </> : null}
            {!isCompleted && !isLocked ? <>
              <Description>{ce.description}</Description>
              <Stats>
                <span>{ce.militaryStrength} Power required to defeat</span>
              </Stats>
            </> : null}
          </EncounterButton>;
        })}
      </List>
    </InnerPage>
  </Page>;
}

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const InnerPage = styled.div`
  max-width: 1200px;
  margin-top: 30px;
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const EncounterButton = styled.button`
  width: 300px;
  height: 110px;
  padding: 8px 3px;
  background-color: #555;
  color: white;
  border-radius: 10px;
  border: none;
  outline: none;
  box-shadow: shared.$box-shadow;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #777;
  }
`;

export const Description = styled.p`
  color: #CCC;
  margin-top: 5px;
  flex: 1;
`;

export const Stats = styled.div`
  
`;