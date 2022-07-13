import { PrestigeUpgrade } from "../shared/types";

export const PRESTIGE_BASE_COST = 1000;
export const PRESTIGE_COST_GROWTH = 1.1;

const upgrades: Record<string, PrestigeUpgrade> = {
  ratz: {
    id: '',
    name: 'Ratz!',
    description: 'Get a Rat Den at the start of the next game.',
  }
};

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;

    function replaceInDescription(variable: string, value: string) {
      upgrade.description = upgrade.description.replaceAll(`{{${variable}}}`, value);
    }
  });

export default upgrades;