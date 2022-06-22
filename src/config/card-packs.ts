import { CardPack } from "../shared/types";
import cards from "./cards";

const cardPacks: Record<string, CardPack> = {
  trash: {
    id: "",
    name: "Dirt Tier",
    cost: 150,
    quantity: 3,
    possibleCards: [{
      card: cards.campfire,
      chance: 0.025,
    }, {
      card: cards.ratDen,
      chance: 0.025,
    }, {
      card: cards.peasant,
      chance: 0.025,
    }, {
      card: cards.forest,
      chance: 0.1,
    }, {
      card: cards.beggar,
      chance: 0.15,
    }, {
      card: cards.ratSnack,
      chance: 0.4,
    }, {
      card: cards.berries,
      chance: 0.275,
    }],
  }
}

Object.keys(cardPacks).forEach((id) => cardPacks[id].id = id);

export default cardPacks;