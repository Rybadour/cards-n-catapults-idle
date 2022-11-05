import styled from 'styled-components';
import { pick } from "lodash";

import useStore from "../../store";
import ArmyGrid from './army-grid';
import PackList from '../shared/pack-list';
import shallow from 'zustand/shallow';
import { SectionHeader } from '../shared/common-styles';
import { useCallback } from 'react';
import { Combatant, RealizedPack } from '../../shared/types';
import CombatantList from './combatant-list';

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
    <ArmySelection>
      <Reserves>
        <SectionHeader>Reserves</SectionHeader>
        <CombatantList units={army.reserves} />
      </Reserves>
      <ArmyDeck>
        <SectionHeader>Army</SectionHeader>
        <CombatantList units={army.deck} />
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
  height: 100%;
  align-items: space-between;
`;

const Reserves = styled.div`
`;

const ArmyDeck = styled.div`
`;