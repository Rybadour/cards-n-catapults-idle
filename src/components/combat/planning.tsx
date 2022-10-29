import styled from 'styled-components';
import { pick } from "lodash";

import useStore from "../../store";
import ArmyGrid from './army-grid';
import PackList from '../shared/pack-list';
import armyPacks from '../../config/army-packs';
import { ArmyPack, Combatant, RealizedPack } from '../../shared/types';
import shallow from 'zustand/shallow';
import { SectionHeader } from '../shared/common-styles';

const realArmyPacks: RealizedPack<Combatant>[] = 
  Object.values(armyPacks).map(ap => ({
    ...ap,
    cost: 100000,
    numBought: 0,
  }));

export function PlanningScene() {
  const combat = useStore(s => pick(
    s.combat, ['playerGrid']
  ), shallow);

  return <Scene>
    <PackList
      packs={realArmyPacks}
      itemDescriptor='Army'
      discoveredPacks={{soldier: true}}
      discoveredPackItems={{rat: false}}
      buyPack={(pack) => {console.log('yup');}}
      buyMaxPack={(pack) => {console.log('yup');}}
    />
    <Army>
      <SectionHeader>Your Army</SectionHeader>

      <ArmyGrid grid={combat.playerGrid} />

      <button>Find an encounter</button>
    </Army>
    <ArmySelection>
      <SectionHeader>Available Units</SectionHeader>
    </ArmySelection>
  </Scene>;
}

const Scene = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px auto 0;
  max-width: 1200px;
  width: 100%;
`;

const Army = styled.div`
`;

const Packs = styled.div`
`;

const ArmySelection = styled.div`
`;