import { Card, CardPack } from "./types";

export function generateCards(cardPack: CardPack): Card[] {
  const cards: Card[] = [];

  for (let i = 0; i < cardPack.quantity; ++i) {
    const r = Math.random();
    let lastChance = 0;
    for (let c = 0; c < cardPack.possibleCards.length; ++c) {
      const card = cardPack.possibleCards[c];
      if (lastChance < r && r < (lastChance + card.chance)) {
        cards.push(card.card);
        break;
      }

      if (c == cardPack.possibleCards.length-1) {
        cards.push(card.card);
      }

      lastChance += card.chance;
    }
  }

  return cards;
}