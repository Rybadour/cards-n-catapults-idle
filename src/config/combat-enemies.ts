import { Enemy } from "../shared/types";

const enemies: Record<string, Enemy> = {
  'rat': {
    id: '',
    name: 'Rat',
    health: 5,
    damage: 1,
    attackSpeed: 0.5,
  }
};

Object.keys(enemies)
  .forEach((e) => {
    const enemy = enemies[e];
    enemy.id = e;
  });

export default enemies;