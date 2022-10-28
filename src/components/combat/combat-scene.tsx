import styled from 'styled-components';
import { PlanningScene } from './planning';

export function CombatScene() {
  return <Scene>
    <PlanningScene />
  </Scene>
}

const Scene = styled.div`
  color: white;
  width: 100%;
`;