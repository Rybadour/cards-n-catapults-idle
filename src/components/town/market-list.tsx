import { CardType } from '../../shared/types';
import { SectionBlurb, SectionHeader } from '../shared/common-styles';
import CardList from '../shared/card-list';

export interface MarketListProps {
}

export default function MarketList(props: MarketListProps) {

  return <div className="market">
    <SectionHeader>Market</SectionHeader>
    <SectionBlurb>Select and place something into the grid to purchase it.</SectionBlurb>
    <CardList allowedCards={[
      CardType.Building,
      CardType.Worker,
      CardType.Treasure,
    ]} />
  </div>;
}

