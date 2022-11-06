import styled from "styled-components";

import PackList from "../shared/pack-list";
import Grid from './grid';
import CardList from './card-list';
import { CardType, GameFeature } from "../../shared/types";

export default function TownScene() {
  return <>
    <SideSection>
      <PackList feature={GameFeature.Economy} />
    </SideSection>
    <Grid />
    <SideSection>
      <CardList cardTypes={[CardType.Building, CardType.Food, CardType.Person, CardType.Resource, CardType.Treasure]} />
    </SideSection>
  </>;
}

const SideSection = styled.div`
  margin-top: 50px;
`;