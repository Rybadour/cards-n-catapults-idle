import { EMPTY_CARD, MatchingGridShape } from "../../shared/types";
import { formatNumber, using } from "../../shared/utils";
import armyCardsConfig from "./army-cards";
import townCardsConfig from "./town-cards";
import enemyCardsConfig from "./enemies";

const allCardsConfig = {
  ...armyCardsConfig,
  ...townCardsConfig,
  ...enemyCardsConfig,
};

Object.keys(allCardsConfig)
  .forEach((cardId) => {
    const card = allCardsConfig[cardId];
    card.id = cardId;

    function replaceInDescription(variable: string, value: string) {
      card.description = card.description.replaceAll(`{{${variable}}}`, value);
    }

    using(card.passive, (p) => {
      let multiplyText = '';
      using(p.multiplyByAdjacent, (mba) => {
        let matchingText = '';
        if (mba.cardTypes) {
          matchingText = mba.cardTypes.map(ct => String(ct)).join(' or ');
        } else if (mba.cards) {
          matchingText = mba.cards
            .map(c => c === EMPTY_CARD ? 'empty tile' : allCardsConfig[c].name)
            .join(' or ');
        }

        const shape = 'nearby' + (mba.shape == MatchingGridShape.AllAdjacent ? ', in all directions' : '');
        multiplyText = ` for each ${matchingText} ${shape}`;
      });
      replaceInDescription('passiveAdjacent', multiplyText);
    });

    using(card.abilityStrengthModifier, (mod) => {
      if (card.passive) { 
        replaceInDescription('modifiedStrength', formatNumber(card.passive.strength * mod.factor, 0, 1));
      }
    });

    using(card.bonusToAdjacent, (bta) => {
      let matching = '';
      if (bta.cardTypes) {
        matching = bta.cardTypes.map(ct => String(ct)).join(' or ');
      } else if (bta.cards) {
        matching = bta.cards.map(c => allCardsConfig[c].name).join(' or ');
      }

      const prefix = (bta.shape === MatchingGridShape.RowAndColumn ?
        `Improves all ${matching} cards in the same row and column` :
        `Improves all nearby ${matching} cards`
      );

      replaceInDescription(
        'bonusToAdjacent',
        `${prefix} by {{bonusToAdjacentAmount}}.`
      );
    });

    using(card.produceCardEffect, (prod) => {
      const possibleCards = prod.possibleCards.map(c => allCardsConfig[c].name).join(' or ');
      replaceInDescription('produceCard', `Generates a ${possibleCards} card nearby`);
    });

    using(card.drawCardEffect, (draw) => {
      const possibleCards = draw.possibleCards.map(c => allCardsConfig[c].name).join(' or ');
      replaceInDescription('drawCard', `Generates a ${possibleCards} card `);
    });

    using(card.costPerSec, (cps) => {
      replaceInDescription('costPerSec', `${cps.cost} ${cps.resource}/s`);
    });
    using(card.costPerUse, (cpu) => {
      replaceInDescription('costPerUse', cpu.cost + ' ' + cpu.resource);
    });
  });

  export default allCardsConfig;