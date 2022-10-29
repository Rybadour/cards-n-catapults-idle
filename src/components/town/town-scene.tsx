import PackList from "../shared/pack-list";
import Grid from './grid';
import CardList from './card-list';
import useStore from "../../store";
import { pick } from "lodash";
import { useCallback } from "react";
import { RealizedCardPack } from "../../shared/types";
import shallow from "zustand/shallow";
import styled from "styled-components";

export default function TownScene() {
  const {cardPacks, buyPack, buyMaxPack}
    = useStore(s => pick(s.cardPacks, ['cardPacks', 'buyPack', 'buyMaxPack']), shallow);
  const discoveredCardPacks = useStore(s => s.discovery.discoveredCardPacks);
  const discoveredCards = useStore(s => s.discovery.discoveredCards);

  const onBuyPack = useCallback((cardPack: RealizedCardPack) => {
    buyPack(cardPack);
  }, [buyPack]);

  const onBuyMaxPack = useCallback((cardPack: RealizedCardPack) => {
    buyMaxPack(cardPack);
  }, [buyMaxPack]);

  return <>
    <SideSection>
      <PackList
        packs={Object.values(cardPacks)}
        itemDescriptor='Card'
        discoveredPacks={discoveredCardPacks}
        discoveredPackItems={discoveredCards}
        buyPack={onBuyPack}
        buyMaxPack={onBuyMaxPack}
      />
    </SideSection>
    <Grid />
    <SideSection>
      <CardList />
    </SideSection>
  </>;
}

const SideSection = styled.div`
  margin-top: 50px;
`;