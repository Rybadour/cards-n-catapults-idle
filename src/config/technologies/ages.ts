import { DynamicTriggerType, ResourceType } from "../../shared/types";
import { TownUpgrade, stoneAgeTech } from "./stone-age";

const ages: Record<string, TechAge> = {
  stoneAge: {
    id: '',
    name: 'Stone Age',
    description: '',
    upgrades: stoneAgeTech,
    megaUpgrades: {
      tradeDeal: {
        id: '',
        name: 'Secret Trade Deal',
        icon: 'cornucopia',
        description: '(Broken) Gain a bonus to selling wood based on Renown.',
        summary: '',
        cost: {}, // Note: Unused atm
        dynamicSellResourceBonus: {
          [ResourceType.Wood]: {
            trigger: [DynamicTriggerType.Resource, ResourceType.Renown],
            getBonus: (input) => ({
              baseMulti: Math.pow(input, 0.2),
            })
          }
        }
      }
    }
  },
  bronzeAge: {
    id: '',
    name: 'Bronze Age',
    description: '',
    upgrades: {},
    megaUpgrades: {}
  }
}

Object.keys(ages)
  .forEach((id) => {
    const age = ages[id];
    age.id = id;

    Object.keys(age.upgrades)
      .forEach((id) => {
        age.upgrades[id].id = id;
      });

    Object.keys(age.megaUpgrades)
      .forEach((id) => {
        age.megaUpgrades[id].id = id;
      });
  });

export default ages;

export interface TechAge {
  id: string,
  name: string,
  description: string,
  upgrades: Record<string, TownUpgrade>,
  megaUpgrades: Record<string, TownUpgrade>,
}

export type RealizedTechAge = {
  unlocked: boolean,
  completed: boolean,
  chosenMegaUpgrade?: string,
} & TechAge;
