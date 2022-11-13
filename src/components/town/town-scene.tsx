import styled from "styled-components";

import PackList from "../shared/pack-list";
import CardList from './card-list';
import { CardType, GameFeature } from "../../shared/types";
import CardGrid from "../shared/card-grid";
import { Resources } from "../shared/resources";

export default function TownScene() {
  return <>
    <SideSection>
      <PackList feature={GameFeature.Economy} />
    </SideSection>
    <MiddleSection>
      <Resources />
      <CardGrid gridId="town" />
    </MiddleSection>
    <SideSection>
      <CardList cardTypes={[CardType.Building, CardType.Food, CardType.Person, CardType.Resource, CardType.Treasure]} />
    </SideSection>
  </>;
}

const SideSection = styled.div`
  margin-top: 50px;
`;

const MiddleSection = styled.div`
  margin: 20px 30px 0;
`;