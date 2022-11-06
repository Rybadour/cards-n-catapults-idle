import { GameFeature, PackItem, Rarity, RealizedPack } from "../shared/types";

export function getItemRarity(chance: number) {
  if (chance < 0.01) {
    return Rarity.UltraRare; 
  } else if (chance < 0.1) {
    return Rarity.Rare;
  } else {
    return Rarity.Common;
  }
}