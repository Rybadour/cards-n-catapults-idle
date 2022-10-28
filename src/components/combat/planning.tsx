import styled from 'styled-components';
import { pick } from "lodash";

import useStore from "../../store";
import ArmyGrid from './army-grid';

export function PlanningScene() {
  const combat = useStore(s => pick(
    s.combat, ['playerGrid']
  ));

  return <Scene>
    <Packs>
      <h2>Packs</h2>
    </Packs>
    <Army>
      <h2>Your Army</h2>

      <ArmyGrid grid={combat.playerGrid} />

      <button>Find an encounter</button>
    </Army>
    <ArmySelection>
      <h2>Available Units</h2>
    </ArmySelection>
  </Scene>;
}

const Scene = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
`;

const Army = styled.div`
`;

const Packs = styled.div`
`;

const ArmySelection = styled.div`
`;