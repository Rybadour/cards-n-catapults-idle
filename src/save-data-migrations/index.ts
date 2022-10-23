import global from "../config/global";

type SaveData = Record<string, any>;

export function isMajorAndMinorVersionEqual(v1: string, v2: string) {
  const [major1, minor1] = v1.split('.');
  const [major2, minor2] = v2.split('.');

  return major1 === major2 && minor1 === minor2; 
}

export function migrateSaveData(saveData: SaveData) {
  const version = saveData.version as string;

  let [saveMajor, saveMinor] = version.split('.').map(s => parseInt(s, 10));
  saveMajor = saveMajor;
  const [major, minor] = version.split('.').map(s => parseInt(s, 10));

  // TODO: Improve when major can be larger numbers
  while(saveMinor < minor) {
    ++saveMinor;
    if (migrations[saveMajor] && migrations[saveMajor][saveMinor]) {
      saveData = migrations[saveMajor][saveMinor](saveData);
    }
  }

  return saveData;
}

const migrations: Record<number, Record<number, (saveData: SaveData) => SaveData>> = {
  0: {
    2: (saveData) => {
      if (saveData.grid && Array.isArray(saveData.grid)) {
        saveData.grid.forEach(space => {
          if (space.card) {
            space.card.cardId = space.card.id;
            delete space.card.id;
          }
        });
      }
      return saveData;
    }
  }
}