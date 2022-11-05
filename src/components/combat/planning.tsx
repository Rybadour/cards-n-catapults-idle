import styled from 'styled-components';
import { pick } from "lodash";
import shallow from 'zustand/shallow';
import { useCallback } from 'react';

import useStore from "../../store";
import PackList from '../shared/pack-list';
import { SectionHeader } from '../shared/common-styles';
import { Combatant, RealizedPack } from '../../shared/types';
import CombatantList from './combatant-list';
import { getTotalUnits, MAX_DECK_SIZE } from '../../store/army';

export function PlanningScene() {
  const army = useStore(s => pick(
    s.army, ['reserves', 'deck', 'packs', 'buyPack', 'buyMaxPack', 'addToDeck', 'returnToReserves']
  ), shallow);

  const onBuyPack = useCallback((cardPack: RealizedPack<Combatant>) => {
    army.buyPack(cardPack);
  }, [army.buyPack]);

  const onBuyMaxPack = useCallback((cardPack: RealizedPack<Combatant>) => {
    army.buyMaxPack(cardPack);
  }, [army.buyMaxPack]);

  const onAddToDeck = useCallback((unit: Combatant) => {
    army.addToDeck(unit);
  }, [army.addToDeck]);

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
        <CombatantList units={army.reserves} onClickUnit={onAddToDeck} />
      </Reserves>
      <ArmyDeck>
        <SectionHeader>Army {getTotalUnits(army.deck)} / {MAX_DECK_SIZE}</SectionHeader>
        <CombatantList units={army.deck} onClickUnit={army.returnToReserves} />
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