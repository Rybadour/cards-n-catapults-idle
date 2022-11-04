import styled from 'styled-components';
import { pick } from "lodash";

import useStore from "../../store";
import ArmyGrid from './army-grid';
import PackList from '../shared/pack-list';
import shallow from 'zustand/shallow';
import { SectionHeader } from '../shared/common-styles';
import { useCallback } from 'react';
import { Combatant, RealizedPack } from '../../shared/types';

export function PlanningScene() {
  const army = useStore(s => pick(
    s.army, ['reserves', 'deck', 'packs', 'buyPack', 'buyMaxPack']
  ), shallow);

  const onBuyPack = useCallback((cardPack: RealizedPack<Combatant>) => {
    army.buyPack(cardPack);
  }, [army.buyPack]);

  const onBuyMaxPack = useCallback((cardPack: RealizedPack<Combatant>) => {
    army.buyMaxPack(cardPack);
  }, [army.buyMaxPack]);


  return <Scene>
    <PackList
      packs={Object.values(army.packs)}
      itemDescriptor='Army'
      discoveredPacks={{soldier: true}}
      discoveredPackItems={{rat: false}}
      buyPack={onBuyPack}
      buyMaxPack={onBuyMaxPack}
    />
    <Army>
      <SectionHeader>Your Army</SectionHeader>

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