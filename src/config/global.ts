// Note: Version has 3 parts: major, minor and patch
// If major or minor is different than a save data migration is required.

import { Scene } from "../store/scenes";

// Otherwise a patch version is used. Ex. Between 0.2.123 and 0.2.450 no migration is required.
const global = {
  version: "0.2.0",
  startingGold: 200,
  startingCards: {
    lumberjack: 1,
  },
  startingTown: [
    ['forest', 'forest', 'forest', 'forest', 'forest'],
    ['forest', '', '', 'forest', 'forest'],
    ['forest', 'forest', '', '', 'forest'],
    ['forest', '', '', '', 'forest'],
    ['forest', 'forest', 'forest', 'forest', 'forest'],
  ],
  unlockedPacks: [],
  startingPrestige: 0,
  startingScene: Scene.Economy,
  autoLoadEnabled: false,
  isDebug: true,
};

export default global;