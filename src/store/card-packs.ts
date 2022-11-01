import { cloneDeep } from "lodash";

import global from "../config/global";
import { Card, MyCreateSlice} from "../shared/types";
import cardPacksConfig from "../config/card-packs";
import { CardsSlice } from "./cards";
import { StatsSlice } from "./stats";
import getPackSliceCreator, { PacksSlice } from "./generic-packs";

export type CardPacksSlice = PacksSlice<Card>;

const createCardPacksSlice: MyCreateSlice<PacksSlice<Card>, [() => StatsSlice, () => CardsSlice]> = (set, get, stats, cards) => {
  return getPackSliceCreator(
    set, get, stats,
    cardPacksConfig,
    (items) => {
      cards().drawCards(items);
    }
  )
};

export default createCardPacksSlice;