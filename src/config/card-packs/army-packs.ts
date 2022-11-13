import { CardPack, GameFeature } from "../../shared/types";
import armyCardsConfig from "../cards/army-cards";

const armyPacks: Record<string, CardPack> = {
  'soldier': {
    id: '',
    name: 'Soldiers',
    feature: GameFeature.Combat,
    baseCost: 100,
    costGrowth: 1.1,
    quantity: 1,
    unlocked: true,
    possibleThings: [{
      thing: armyCardsConfig.pikeman,
      chance: 0.3,
    }, {
      thing: armyCardsConfig.archer,
      chance: 0.3,
    }, {
      thing: armyCardsConfig.cavalry,
      chance: 0.1,
    }]
  }
};

Object.keys(armyPacks)
  .forEach((e) => {
    armyPacks[e].id = e;
  });

export default armyPacks;