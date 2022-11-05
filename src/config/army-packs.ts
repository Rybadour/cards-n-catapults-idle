import { ArmyPack, ResourceType } from "../shared/types";
import combatants from "./combatants";

const armyPacks: Record<string, ArmyPack> = {
  'soldier': {
    id: '',
    name: 'Soldiers',
    baseCost: 1,
    costGrowth: 1.1,
    quantity: 1,
    unlocked: true,
    possibleThings: [{
      thing: combatants.archer,
      chance: 0.3,
    }, {
      thing: combatants.pikeman,
      chance: 0.3,
    }]
  }
};

Object.keys(armyPacks)
  .forEach((e) => {
    armyPacks[e].id = e;
  });

export default armyPacks;