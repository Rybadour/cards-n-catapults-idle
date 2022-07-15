import { PrestigeUpgrade } from "../shared/types";
import { formatNumber } from "../shared/utils";

export const PRESTIGE_BASE_COST = 100;
export const PRESTIGE_COST_GROWTH = 1.1;

const upgrades: Record<string, PrestigeUpgrade> = {
  ratz: {
    id: '',
    name: 'Ratz!',
    description: 'Get a Rat Den at the start of the next game.',
    abilityStrength: 1,
  },
  rationing: {
    id: '',
    name: 'Rationing',
    description: 'Food has {{strengthAsPercent}} more capacity',
    abilityStrength: 0.05,
  }
};

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;

    function replaceInDescription(variable: string, value: string) {
      upgrade.description = upgrade.description.replaceAll(`{{${variable}}}`, value);
    }

    replaceInDescription('strengthAsPercent', formatNumber(upgrade.abilityStrength * 100, 0, 0) + '%');
  });

export default upgrades;