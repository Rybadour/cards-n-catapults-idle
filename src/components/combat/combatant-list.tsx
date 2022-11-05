import styled from 'styled-components';
import combatants from '../../config/combatants';

import Icon from '../../shared/components/icon';
import { Combatant } from '../../shared/types';

interface CombatantListProps {
  units: Record<string, number>,
  onClickUnit: (unit: Combatant) => void,
}

export default function CombatantList(props: CombatantListProps) {
  return <List>
    {Object.entries(props.units).map(([id, quantity]) =>
      <CombatantCard
        key={id}
        combatant={combatants[id]}
        quantity={quantity}
        onClick={() => props.onClickUnit(combatants[id])}
      />
    )}
  </List>;
}

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

function CombatantCard(props: {combatant: Combatant, quantity: number, onClick: () => void}) {
  return <CardContainer>
    <Card onClick={props.onClick}>
      <CardHeader>
        <Icon icon={props.combatant.icon} size="xs" />
        <Name>{props.combatant.name}</Name>
        <span>{props.quantity}</span>
      </CardHeader>
      <Description>{props.combatant.description}</Description>
      <Stats>
        <Stat>
          <Icon icon="hearts" size="xs" />
          {props.combatant.health}
        </Stat>
        <Stat>
          <Icon icon="crossed-swords" size="xs" />
          {props.combatant.damage}
        </Stat>
      </Stats>
    </Card>
  </CardContainer>;
}

const cardWidth = "164px";
const cardHeight = "220px";

const CardContainer = styled.div`
  position: relative;
  width: ${cardWidth};
  height: 40px;
  overflow: hidden;

  &:hover {
    z-index: 10;
    overflow: visible;
  }
`;

const Card = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${cardWidth};
  min-height: ${cardHeight};
  color: white;
  background-color: #555;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box;
  border: 2px solid #555;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &:hover {
    background-color: #666;
    box-shadow: #222 0px 0px 3px 2px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding-right: 3px;
`;

const Name = styled.strong`
  width: 100%;
`;

const Description = styled.p`
  font-size: 16px;
  padding: 0 5px;
`;

const Stats = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 5px; 
  gap: 14px;
`;

const Stat = styled.div`
  display: flex;
  gap: 4px;
`;