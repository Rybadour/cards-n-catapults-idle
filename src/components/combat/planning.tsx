import styled from 'styled-components';

import PackList from '../shared/pack-list';
import { SectionHeader } from '../shared/common-styles';
import { useCallback } from 'react';
import { Combatant, RealizedPack } from '../../shared/types';

export function PlanningScene() {
  const onBuyPack = useCallback((cardPack: RealizedPack<Combatant>) => {
  }, []);

  const onBuyMaxPack = useCallback((cardPack: RealizedPack<Combatant>) => {
  }, []);

  const onAddToDeck = useCallback((unit: Combatant) => {
  }, []);

  return <Scene>
    <PackList
      packs={[]}
      itemDescriptor='Army'
      discoveredPacks={{soldier: true}}
      discoveredPackItems={{rat: false}}
      buyPack={onBuyPack}
      buyMaxPack={onBuyMaxPack}
    />
    <ArmySelection>
      <Reserves>
        <SectionHeader>Reserves</SectionHeader>
      </Reserves>
      <ArmyDeck>
        <SectionHeader>Army</SectionHeader>
      </ArmyDeck>
    </ArmySelection>
  </Scene>;
}

const Scene = styled.div`
  display: flex;
  gap: 50px;
  margin: 30px auto 0;
  max-width: 1200px;
  width: 100%;
`;

const ArmySelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 50%;
  align-items: space-between;
`;

const Reserves = styled.div`
  padding-bottom: 160px;
`;

const ArmyDeck = styled.div`
`;