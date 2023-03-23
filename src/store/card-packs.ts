import { Card } from "../shared/types";
import cardPacksConfig from "../config/card-packs";
import { CardsSlice } from "./cards";
import { StatsSlice } from "./stats";
import getPackSliceCreator, { PacksSlice } from "./generic-packs";
import { DiscoverySlice } from "./discovery";
import { MyCreateSlice } from ".";

export type CardPacksSlice = PacksSlice<Card>;

const createCardPacksSlice: MyCreateSlice<PacksSlice<Card>, [
  () => StatsSlice, () => CardsSlice, () => DiscoverySlice,
]> = (set, get, stats, cards, discovery) => {
  return getPackSliceCreator(
    set, get, stats, discovery,
    cardPacksConfig,
    (items) => {
      cards().drawCards(items);
    }
  )
};

export default createCardPacksSlice;