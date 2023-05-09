import { ResourceType, TechAge, TownUpgrade } from "../../shared/types";
import { stoneAgeTech } from "./stone-age";

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
        description: 'Wood can be sold for twice as much.',
        summary: '',
        cost: {}, // Note: Unused atm
        sellResourceBonus: {
          [ResourceType.Wood]: {
            baseMulti: 2,
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
  });

export default ages;