import { CombatEncounter } from "../shared/types";

const combatEncounters: Record<string, CombatEncounter> = {
  'rats': {
    id: '',
    name: 'Rats',
    description: 'Classic start to a hero\'s adventure!',
    militaryStrength: 100,
    unlockedBy: '',
    staticCards: [
      ['', '', '', '', ''],
      ['', 'rat', '', 'rat', ''],
      ['rat', '', '', '', 'rat'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ]
  },
  'moreRats': {
    id: '',
    name: 'More Rats!',
    description: 'Okay this is getting ridiculous, rid yourself of these vermin.',
    militaryStrength: 500,
    unlockedBy: 'rats',
    staticCards: [
      ['', '', 'rat', '', ''],
      ['', 'rat', '', 'rat', ''],
      ['rat', '', '', '', 'rat'],
      ['', 'rat', '', 'rat', ''],
      ['', '', '', '', ''],
    ]
  },
  'ratden': {
    id: '',
    name: 'Rat Den',
    description: 'These ones went rogue, show them who\'s the protagonist in this story!',
    militaryStrength: 1000,
    unlockedBy: 'moreRats',
    staticCards: [
      ['', '', '', '', ''],
      ['rat', '', '', '', 'rat'],
      ['ratDen', 'rat', '', 'rat', 'ratDen'],
      ['rat', '', '', '', 'rat'],
      ['', '', '', '', ''],
    ]
  },
}

Object.keys(combatEncounters)
  .forEach((ce) => {
    const encounter = combatEncounters[ce];
    encounter.id = ce;
  });

export default combatEncounters;