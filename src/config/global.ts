// Note: Version has 3 parts: major, minor and patch
// If major or minor is different than a save data migration is required.

import { Scene } from "../store/scenes";

// Otherwise a patch version is used. Ex. Between 0.2.123 and 0.2.450 no migration is required.
const global = {
  version: "0.2.0",
  startingGold: 1000,
  startingCards: {
    farmer: 1,
  },
  startingTown: [
    //['beggar', 'beggar', 'beggar', '', ''],
    //['beggar', 'bard', 'beggar', '', ''],
    //['beggar', 'beggar', 'beggar', 'beggar', 'beggar'],
    //['', '', 'beggar', 'bard', 'beggar'],
    //['', '', 'beggar', 'beggar', 'beggar'],
  ],
  unlockedPacks: [],
  startingPrestige: 0,
  startingScene: Scene.Economy,
  autoLoadEnabled: false,
  isDebug: true,
};

export default global;