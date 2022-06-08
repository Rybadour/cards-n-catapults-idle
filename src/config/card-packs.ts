import { CardPack } from "../shared/types";
import cards from "./cards";

const cardPacks: Record<string, CardPack> = {
  trash: {
    id: "",
    name: "Dirt Tier",
    cost: 100,
    quantity: 3,
    possibleCards: [{
      card: cards.ratDen,
      chance: 0.05,
    }, {
      card: cards.peasant,
      chance: 0.05,
    }, {
      card: cards.beggar,
      chance: 0.2,
    }, {
      card: cards.ratSnack,
      chance: 0.7,
    }],
  }
}

Object.keys(cardPacks).forEach((id) => cardPacks[id].id = id);

export default cardPacks;