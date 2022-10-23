import global from "../config/global";

type SaveData = Record<string, any>;

export function migrateSaveData(saveData: SaveData) {
  if (saveData.version && saveData.version === global.version) return saveData;
  const version = saveData.version as string;

  let [saveMajor, saveMinor] = version.split('.').map(s => parseInt(s, 10));
  const [major, minor] = version.split('.').map(s => parseInt(s, 10));

  // TODO: Improve when major can be larger numbers
  while(saveMinor < minor) {
    ++saveMinor;
    if (migrations[saveMajor] && migrations[saveMajor][saveMinor]) {
      saveData = migrations[saveMajor][saveMinor](saveData);
    }
  }
}

const migrations: Record<number, Record<number, (saveData: SaveData) => SaveData>> = {
  0: {
    3: (saveData) => {
      // TBA: Migrate grid spaces from .id to .cardId
      return saveData;
    }
  }
}