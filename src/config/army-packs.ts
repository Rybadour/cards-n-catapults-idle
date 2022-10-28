import { ArmyPack, ResourceType } from "../shared/types";
import combatants from "./combatants";

const armyPacks: Record<string, ArmyPack> = {
  'soldier': {
    id: '',
    name: 'Soldiers',
    baseCost: 1000,
    costGrowth: 1.1,
    quantity: 1,
    unlocked: true,
    possibleThings: [{
      thing: combatants.rat,
      chance: 0.2,
    }]
  }
};

Object.keys(armyPacks)
  .forEach((e) => {
    armyPacks[e].id = e;
  });

export default armyPacks;