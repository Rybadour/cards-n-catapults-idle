import { pick } from 'lodash';
import styled from 'styled-components';
import { useCallback } from 'react';

import combatEncounters from '../../config/combat-encounters';
import useStore from '../../store';

export default function EncounterList() {
  const combat = useStore(s => pick(
    s.combat, ['chooseEncounter']
  ));

  const chooseEncounter = useCallback((encounter) => {
    combat.chooseEncounter(encounter);
  }, [combat.chooseEncounter]);

  return <Page>
    <List>
      <h2>Encounters</h2>
      <p>Choose an encounter to test your mettle!</p>

      {Object.values(combatEncounters).map(ce =>
        <EncounterButton key={ce.id} className="encounter" onClick={() => chooseEncounter(ce)}>
          <strong className="name">{ce.name}</strong>
          <Description>{ce.description}</Description>
          <Stats>
            <span>{ce.militaryStrength} Power required to defeat</span>
          </Stats>
        </EncounterButton>
      )}
    </List>
  </Page>;
}

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const List = styled.div`
  width: 500px;
  margin-top: 30px;
`;

export const EncounterButton = styled.button`
  padding: 10px;
  background-color: #555;
  color: white;
  border-radius: 10px;
  border: none;
  outline: none;
  box-shadow: shared.$box-shadow;

  &:hover {
    background-color: #777;
  }
`;

export const Description = styled.p`
  color: #CCC;
`;

export const Stats = styled.div`
  
`;