import { pick } from 'lodash';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { CardType, GameFeature } from '../../shared/types';

import useStore from '../../store';
import CardGrid from '../shared/card-grid';
import PackList from '../shared/pack-list';
import CardList from '../town/card-list';

export default function ActiveEncounter() {
  const combat = useStore(s => pick(
    s.combat, ['encounter', 'armyGrid', 'chooseEncounter']
  ), shallow);
  const combatGrid = useStore(s => pick(
    s.combatGrid, ['gridSpaces', 'clearGrid', 'returnCard', 'replaceCard']
  ), shallow);

  return <Page>
    <PackList feature={GameFeature.Combat} />

    <div>
      <h2>Fighting {combat.encounter?.name}</h2>

      <CardGrid
        grid={combatGrid.gridSpaces}
        onClearGrid={combatGrid.clearGrid}
        onReturnCard={combatGrid.returnCard}
        onReplaceCard={combatGrid.replaceCard}
      />
    </div>

    <CardList cardTypes={[CardType.Soldier, CardType.Food, CardType.Treasure]} />
  </Page>;
}

const Page = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
`;