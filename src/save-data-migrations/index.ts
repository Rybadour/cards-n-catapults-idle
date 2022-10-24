import global from "../config/global";
import { LoadDataError, SaveData } from "../store/saving-loading";

export function isMajorAndMinorVersionEqual(v1: string, v2: string) {
  const [major1, minor1] = v1.split('.');
  const [major2, minor2] = v2.split('.');

  return major1 === major2 && minor1 === minor2; 
}

export function migrateSaveData(saveData: SaveData): SaveData | LoadDataError {
  const version = saveData.version as string;

  let [saveMajor, saveMinor] = version.split('.').map(s => parseInt(s, 10));
  saveMajor = saveMajor;
  const [major, minor] = global.version.split('.').map(s => parseInt(s, 10));

  // TODO: Improve when major version starts being used

  while(saveMinor < minor) {
    ++saveMinor;
    if (migrations[saveMajor] && migrations[saveMajor][saveMinor]) { 
      const migrationVersion = `${saveMajor}.${saveMinor}.0`;
      try {
        saveData = migrations[saveMajor][saveMinor](saveData);
        saveData.version = migrationVersion;
      } catch (ex) {
        return {
          saveVersion: saveData.version,
          failedMigrationVersion: migrationVersion,
          exception: ex,
        };
      }
    }
  }

  saveData.version = global.version;

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