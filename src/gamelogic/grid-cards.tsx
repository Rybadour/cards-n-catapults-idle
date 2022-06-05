import { CardsContext } from "../contexts/cards";
import { GridContext } from "../contexts/grid";

export function replaceSpaceWithCard(grid: GridContext, cards: CardsContext, x: number, y: number) {
  if (cards.selectedCard == null || !cards.hasCard(cards.selectedCard)) {
    return;
  }

  const oldCard = grid.replaceCard(x, y, cards.selectedCard);
  if (oldCard) {
    // Combine with below call
    cards.addCard(oldCard);
  }

  cards.removeCard(cards.selectedCard);
}