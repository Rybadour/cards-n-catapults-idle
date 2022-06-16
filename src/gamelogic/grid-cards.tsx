import { CardsContext } from "../contexts/cards";
import { GridContext } from "../contexts/grid";
import { Card, CardPack, RealizedCard } from "../shared/types";

export function replaceSpaceWithCard(grid: GridContext, cards: CardsContext, x: number, y: number) {
  if (cards.selectedCard == null || !cards.hasCard(cards.selectedCard)) {
    return;
  }

  const quantity = cards.cards[cards.selectedCard.id]; 
  const oldCard = grid.replaceCard(x, y, createCard(cards.selectedCard, quantity));
  cards.replaceCard(oldCard);
}

export function createCard(card: Card, quantity: number): RealizedCard {
  return {
    ...card,
    modifiedStrength: 0,
    isExpiredAndReserved: false,
    durability: (quantity >= 1 ? 1 : quantity) * (card.maxDurability ?? 0),
    timeLeftMs: card.cooldownMs,
  };
}