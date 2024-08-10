import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { pick } from 'lodash';
import shallow from 'zustand/shallow';

import Icon from '../../shared/components/icon';
import { Card, CardType } from '../../shared/types';
import { enumFromKey, formatNumber } from '../../shared/utils';
import useStore from '../../store';
import resourcesConfig from '../../config/resources';
import styled from 'styled-components';

export interface CardListProps {
  allowedCards: CardType[],
}

export default function CardList(props: CardListProps) {
  const cardDefs = useStore(s => s.cardDefs.defs);

  const [closedCategories, setClosedCategories] = useState<Partial<Record<CardType, boolean>>>({})
  const cardsDiscovered = useStore(s => s.discovery.cardsDiscoveredThisPrestige);

  const onToggleCategory = useCallback((cardType: CardType) => {
    const newClosedCategories = { ...closedCategories };
    newClosedCategories[cardType] = !newClosedCategories[cardType];
    setClosedCategories(newClosedCategories);
  }, [closedCategories]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cardsDiscovered]);

  return <CategoriesContainer>
    {Object.keys(CardType)
      .map(c => enumFromKey(CardType, c))
      .filter(cardType => !!cardType && props.allowedCards.includes(cardType))
      .map(cardType => ({
        cardType,
        cardList: Object.values(cardDefs).filter(card => 
          cardsDiscovered[card.id] &&
          card.type == cardType
        )
      }))
      .filter(({cardList}) => cardList.length > 0)
      .map(({cardType, cardList}) =>
        <Category
          key={cardType}
          cardType={cardType!}
          cardList={cardList}
          isOpen={closedCategories[cardType!] ?? false}
          onToggleCategory={onToggleCategory}
        />
      )
    }
  </CategoriesContainer>;
}

type CategoryProps = {
  cardType: CardType,
  cardList: Card[],
  isOpen: boolean,
  onToggleCategory: (cardType: CardType) => void
};
function Category(props: CategoryProps) {
  const toggleCategory = useCallback(() => {
    props.onToggleCategory(props.cardType);
  }, [props.onToggleCategory, props.cardType]);

  return <CategoryStyled>
    <CategoryHeader onClick={toggleCategory}>
      {props.isOpen ?
        <FontAwesomeIcon icon="chevron-up" /> :
        <FontAwesomeIcon icon="chevron-down" />
      }
      <span className="label">{props.cardType}</span>
    </CategoryHeader>
    <CardsInCategory className={classNames({hidden: props.isOpen})}>
      {props.cardList.map(card =>
        <CardInInventory key={card.id} cardDef={card} />
      )}
    </CardsInCategory>
  </CategoryStyled>
}

function CardInInventory(props: {cardDef: Card}) {
  const cardDef = props.cardDef;
  const cards = useStore(s => pick(s.cards, ['cards', 'selectedCard', 'setSelectedCard']), shallow);
  const cardTracking = cards.cards[cardDef.id];

  return <CardContainer key={cardDef.id}>
    <CardStyled
      className={classNames({
        selected: cardDef.id === cards.selectedCard,
      })}
      onClick={() => cards.setSelectedCard(cardDef.id)}
    >
      <Title>
        <Icon size="sm" icon={cardDef.icon} />
        <span className="name">{cardDef.name}</span>
        {!cardDef.cost &&
          <span className="amount">{formatNumber(cardTracking.numPurchased, 0, 1)}</span>
        }
      </Title>
      <Cost>
        {cardDef.cost && <>
        <CostLabel>cost: </CostLabel>
        <Icon size="xs" icon={resourcesConfig[cardDef.cost.resource].icon} />
        <span>{formatNumber(cardTracking.cost, 0, 0)}</span>
        </>}
      </Cost>
      <Description>{cardDef.description}</Description>

      <Stats>
        <Tier data-tip="Tier" data-offset="{'bottom': -5}">
          <Icon size="sm" icon="round-star" />
          <span className="value">{cardDef.tier}</span>
        </Tier>
        {cardDef.maxDurability ?
          <Stat data-tip="Food capacity" data-offset="{'bottom': -5}">
            <Icon size="xs" icon="ham-shank" />
            <span>{formatNumber(cardDef.maxDurability, 0, 0)}</span>
          </Stat> :
          null
        }
        {cardDef.foodDrain ?
          <Stat data-tip="Food Drain" data-offset="{'bottom': -5}">
            <Icon size="xs" icon="ham-shank" />
            <span>-{cardDef.foodDrain}/s</span>
          </Stat> :
          null
        }
        {cardDef.cooldownMs ?
          <Stat data-tip="Cooldown" data-offset="{'bottom': -5}">
            <Icon size="xs" icon="backward-time" />
            <span>{formatNumber(cardDef.cooldownMs / 1000, 0, 0)}s</span>
          </Stat> :
          null
        }
      </Stats>
    </CardStyled>
  </CardContainer>;
}

const cardWidth = 164;
const cardHeight = 220;
const cardsGap = 10;
const cardListPadding = 10;

const CategoriesContainer = styled.div`
  box-sizing: border-box;
  width: ${cardWidth * 2 + cardsGap + cardListPadding * 2}px;
  height: 100%;
`;

const CategoryStyled = styled.div`
  margin-bottom: 10px;
`;

const CategoryHeader = styled.div`
  font-size: 16px;
  color: white;
  cursor: pointer;

  .label {
    margin-left: 10px;
  }
`;

const CardsInCategory = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  width: 100%;
  grid-gap: ${cardsGap}px;
  padding: ${cardListPadding}px;
  margin-bottom: 20px;

  &.hidden {
    display: none;
  }
`;

const CardContainer = styled.div`
  position: relative;
  width: ${cardWidth}px;
  height: 64px;
  overflow: hidden;

  &:hover {
    z-index: 10;
    overflow: visible;
  }
`;

const CardStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${cardWidth}px;
  min-height: ${cardHeight}px;
  color: white;
  background-color: #555;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box;
  border: 2px solid #555;
  display: flex;
  flex-direction: column;
  grid-gap: 10px;

  &:hover {
    background-color: #666;
    box-shadow: #222 0px 0px 3px 2px;
  }

  &.selected {
    border: 2px solid white;
    background-color: #666;
  }
`;

const Title = styled.div`
  display: flex;
  grid-gap: 10px;
  align-items: center;
  padding-right: 3px;

  .name {
    width: 100%;
  }

  .icon {
    filter: drop-shadow(1px 1px 6px black);
  }
`;

const Cost = styled.div`
  display: flex;
  min-height: 16px;
  gap: 4px;
  align-items: center;
  padding-left: 0px;
`;

const CostLabel = styled.span`
  color: #BBB;
`;

const Description = styled.div`
  font-size: 16px;
  padding: 0 5px;
`;

const Stats = styled.div`
  margin-top: auto;
  display: flex;
  grid-gap: 8px;
  font-size: 15px;
  flex-wrap: wrap-reverse;
`;

const Stat = styled.div`
  border-radius: 3px;
  background-color: #555;
  padding: 3px 5px;
  height: 26px;

  display: flex;
  justify-content: center;
  align-items: center;

  span {
    padding-top: 2px;
  }

  .icon {
    margin-right: 4px;
  }
`;

const Tier = styled.div`
  position: relative;
  width: 26px;
  height: 26px;

  .icon {
    width: 100%;
    filter: brightness(0.8);
  }

  .value {
    display: inline-block;
    width: 100%;
    position: absolute;
    top: 8px;
    left: 0;
    color: black;
    font-weight: bold;
    text-align: center;
  }
`;

/* *
TODO: Remember card buttons exist!
<CardButtons width={46}>
  <CardButton
    label={
      <span data-tip="Mastery Bonus" data-place="left" data-offset="{'left': 7}">
        <Icon icon="progression" size="xs" />
      </span>
    }
    onClick={() => {}}
  />
</CardButtons>
/* */