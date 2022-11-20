// Note: Version has 3 parts: major, minor and patch
// If major or minor is different than a save data migration is required.
// Otherwise a patch version is used. Ex. Between 0.2.123 and 0.2.450 no migration is required.
const global = {
  version: "0.2.0",
  startingGold: 20000,
  startingCards: {beggar: 1, bard: 2, ratSnack: 20, berries: 10, mushrooms: 20, archer: 2, pikeman: 4, cavalry: 2, campfire: 2},
  startingTown: [
    ['beggar', 'beggar', 'beggar', '', ''],
    ['beggar', 'bard', 'beggar', '', ''],
    ['beggar', 'beggar', 'beggar', 'beggar', 'beggar'],
    ['', '', 'beggar', 'bard', 'beggar'],
    ['', '', 'beggar', 'beggar', 'beggar'],
  ],
  unlockedPacks: [],
  startingPrestige: 0,
  autoLoadEnabled: false,
  isDebug: true,
};

export default global;