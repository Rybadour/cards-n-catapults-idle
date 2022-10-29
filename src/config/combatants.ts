import { Combatant } from "../shared/types";

const combatants: Record<string, Combatant> = {
  'rat': {
    id: '',
    name: 'Rat',
    icon: 'rat',
    health: 5,
    damage: 1,
    attackSpeed: 0.5,
  }
};

Object.keys(combatants)
  .forEach((e) => {
    combatants[e].id = e;
  });

export default combatants;