import styled from 'styled-components';
import ActiveEncounter from './active-encounter';

export function CombatScene() {
  return <Scene>
    <ActiveEncounter />
  </Scene>
}

const Scene = styled.div`
  color: white;
  width: 100%;
`;