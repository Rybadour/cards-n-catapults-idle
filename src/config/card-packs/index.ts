import armyPacks from "./army-packs";
import townPacks from "./town-packs";

const allPacksConfig = {
  ...townPacks,
  ...armyPacks,
};

Object.keys(allPacksConfig).forEach((id) => {
  allPacksConfig[id].id = id;
  allPacksConfig[id].possibleThings = allPacksConfig[id].possibleThings.sort((a, b) => {
    return a.chance - b.chance;
  });
});

export default allPacksConfig;