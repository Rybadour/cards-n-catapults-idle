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
      ['rat', '', '', '', ''],
      ['', '', '', 'rat', ''],
      ['', '', '', '', ''],
    ],
    rewards: {
      cards: {
        'ratSnack': 2
      }
    }
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
    ],
    rewards: {
      cards: {
        'ratSnack': 6
      }
    }
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
      ['ratDenEnemy', 'rat', '', 'rat', 'ratDenEnemy'],
      ['rat', '', '', '', 'rat'],
      ['', '', '', '', ''],
    ],
    rewards: {
      cards: {
        'ratSnack': 10,
        'ratDen': 1,
      },
      unlockedCards: ['ratDen']
    }
  },
}

Object.keys(combatEncounters)
  .forEach((ce) => {
    const encounter = combatEncounters[ce];
    encounter.id = ce;
  });

export default combatEncounters;