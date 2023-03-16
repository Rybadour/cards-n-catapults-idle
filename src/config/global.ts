// Note: Version has 3 parts: major, minor and patch
// If major or minor is different than a save data migration is required.

import { Scene } from "../store/scenes";

// Otherwise a patch version is used. Ex. Between 0.2.123 and 0.2.450 no migration is required.
const global = {
  version: "0.2.0",
  startingGold: 100,
  startingCards: {
    lumberjack: 1,
  },
  startingTown: {
    fill: 'forest',
    width: 9,
    height: 9,
    center: {x: 4, y: 4},
    empties: [
      {x: -1, y: -1},
      {x: 0, y: -1},
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
    ]
  },
  unlockedPacks: [],
  startingPrestige: 0,
  startingScene: Scene.Economy,
  autoLoadEnabled: false,
  isDebug: true,
};

export default global;