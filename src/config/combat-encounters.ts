import { CombatEncounter } from "../shared/types";

const combatEncounters: Record<string, CombatEncounter> = {
  'ratden': {
    id: '',
    name: 'Rat Den',
    description: 'These ones went rogue, show them who\'s the protagonist in this story!',
    militaryStrength: 1000,
    staticCards: [
      ['', '', '', '', ''],
      ['rat', '', '', '', 'rat'],
      ['ratDen', 'rat', '', 'rat', 'ratDen'],
      ['rat', '', '', '', 'rat'],
      ['', '', '', '', ''],
    ]
  }
}

Object.keys(combatEncounters)
  .forEach((ce) => {
    const encounter = combatEncounters[ce];
    encounter.id = ce;
  });

export default combatEncounters;