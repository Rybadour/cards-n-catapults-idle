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

  return <List>
    <h2>Encounters</h2>
    <p>Choose an encounter to test your mettle!</p>

    {Object.values(combatEncounters).map(ce =>
      <EncounterButton key={ce.id} className="encounter" onClick={() => chooseEncounter(ce)}>
        <strong className="name">{ce.name}</strong>
        <Description>{ce.description}</Description>
      </EncounterButton>
    )}
  </List>;
}

export const List = styled.div`
  width: 200px;
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