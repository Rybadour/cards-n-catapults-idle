import { Combatant } from "../shared/types";

const combatants: Record<string, Combatant> = {
  'rat': {
    id: '',
    name: 'Rat',
    icon: 'rat',
    description: 'Just a cute little rodent with a few sharp teeth!',
    health: 5,
    damage: 1,
  },

  'pikeman': {
    id: '',
    name: 'Pikeman',
    icon: 'pikeman',
    description: 'He has a big pointy stick.',
    health: 10,
    damage: 3,
  },
  'archer': {
    id: '',
    name: 'Archer',
    icon: 'bowman',
    description: 'Archer that shoots arrows or something and ... ya.',
    health: 4,
    damage: 5,
  },
};

Object.keys(combatants)
  .forEach((e) => {
    combatants[e].id = e;
  });

export default combatants;