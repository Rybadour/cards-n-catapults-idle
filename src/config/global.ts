// Note: Version has 3 parts: major, minor and patch
// If major or minor is different than a save data migration is required.
// Otherwise a patch version is used. Ex. Between 0.2.123 and 0.2.450 no migration is required.
const global = {
  version: "0.2.0",
  startingGold: 20000,
  startingCards: {beggar: 1},
  unlockedPacks: [],
  startingPrestige: 0,
  autoLoadEnabled: false,
  isDebug: true,
};

export default global;