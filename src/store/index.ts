import { letterSpacing } from "@mui/system";
import { access } from "fs";
import create from "zustand";
import createCardPacksLens, { CardPacksSlice } from "./card-packs";

import createDiscoveryLens, { DiscoverySlice } from "./discovery";

export type FullStore = {
  discovery: DiscoverySlice,
  cardPacks: CardPacksSlice,
}

const useStore = create<FullStore>((set, get) => {
  const discovery = createDiscoveryLens(set, get);
  const cards = createCardsLens(set, get, discovery);
  const cardPacks = createCardPacksLens(set, get, cards);

  return [discovery, cards, cardPacks]
    .reduce((acc, lens) => ({...acc, [lens.key]: lens.slice}));
});

export default useStore;