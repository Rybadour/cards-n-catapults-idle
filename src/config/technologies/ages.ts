import { TechAge, TownUpgrade } from "../../shared/types";
import { stoneAgeTech } from "./stone-age";

const ages: Record<string, TechAge> = {
  stoneAge: {
    id: '',
    name: 'Stone Age',
    description: '',
    upgrades: stoneAgeTech
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