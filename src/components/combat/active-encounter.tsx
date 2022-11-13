import { pick } from 'lodash';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { BUILDING_BLUE } from '../../shared/constants';
import { CardType, GameFeature } from '../../shared/types';
import { formatNumber } from '../../shared/utils';

import useStore from '../../store';
import CardGrid from '../shared/card-grid';
import PackList from '../shared/pack-list';
import { ProgressBar } from '../shared/progress-bar';
import { Resources } from '../shared/resources';
import CardList from '../town/card-list';

export default function ActiveEncounter() {
  const combat = useStore(s => pick(
    s.combat, ['encounter', 'armyGrid', 'chooseEncounter']
  ), shallow);
  const resources = useStore(s => s.stats.resources);

  if (!combat.encounter) {
    return <h2>No encounter?</h2>;
  }

  return <Page>
    <PackList feature={GameFeature.Combat} />

    <div>
      <CombatTitle>Fighting {combat.encounter.name}</CombatTitle>
      <CombatDescription>{combat.encounter.description}</CombatDescription>
      <CombatProgress>
        <ProgressText>
          <span>{formatNumber(resources.Power, 0, 0)}</span>
          <span>out of</span>
          <span>{formatNumber(combat.encounter.militaryStrength ?? 0, 0, 0)}</span>
        </ProgressText>
        <ProgressBar
          progress={resources.Power / combat.encounter.militaryStrength}
          color={BUILDING_BLUE}
          height={10}
          noBorder
        />
      </CombatProgress>

      <Resources />
      <CardGrid gridId='combat' />
    </div>

    <CardList cardTypes={[CardType.Soldier, CardType.Food, CardType.Treasure]} />
  </Page>;
}

const Page = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
`;

const CombatTitle = styled.h2`
  margin: 0;
  margin-top: 20px;
`;

const CombatDescription = styled.p`
  color: #777;
  margin: 0;
  margin-bottom: 10px;
`;

const CombatProgress = styled.div`
  margin-bottom: 20px;
`;

const ProgressText = styled.p`
  display: flex;
  gap: 4px;
  margin: 0;
`;