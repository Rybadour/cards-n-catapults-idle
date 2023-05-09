import styled, { css } from "styled-components";
import {useFloating, useHover, useInteractions} from '@floating-ui/react';

import agesConfig from "../../config/technologies/ages";
import Icon from "../../shared/components/icon";
import useStore from "../../store";
import { SectionHeader } from "../shared/common-styles";
import { useCallback, useState } from "react";
import { ResourceType, TownUpgrade } from "../../shared/types";
import resourceIconMap from "../../config/resources";
import { enumFromKey } from "../../shared/utils";

export default function Upgrades() {
  const upgrades = useStore(s => s.upgrades);

  const onPurchase = useCallback((ageId: string, upId: string) => {
    upgrades.purchaseUpgrade(ageId, upId);
  }, [upgrades]);

  return <Container>
    {Object.values(upgrades.techAges)
      .filter((age) => age.unlocked)
      .map((age) => 
        <TechAgeSection>
          <SectionHeader>{age.name}</SectionHeader>

          <UpgradeList>
            {Object.values(age.upgrades).map((up) =>
              <Upgrade
                key={up.id}
                upgrade={up}
                bought={upgrades.purchasedUpgrades[age.id][up.id]}
                onPurchase={() => onPurchase(age.id, up.id)}
              />
            )}
          </UpgradeList>

          {age.completed && 
            <MegaUpgradesContainer>
              <MegaUpgradesTitle>Choose one major breakthrough:</MegaUpgradesTitle>

              <MegaUpgradesList>
                <UpgradeList>
                  {Object.values(age.megaUpgrades).map((up) =>
                    <Upgrade
                      key={up.id}
                      upgrade={up}
                      bought={age.chosenMegaUpgrade === up.id}
                      onPurchase={() => upgrades.chooseMegaUpgrade(age.id, up.id)}
                    />
                  )}
                </UpgradeList>
              </MegaUpgradesList>
            </MegaUpgradesContainer>
          }
        </TechAgeSection>
    )}
  </Container>
}

function Upgrade(props: {upgrade: TownUpgrade, bought: boolean, onPurchase: () => void}) {
  const [isOpen, setIsOpen] = useState(false);
  const {refs, floatingStyles, context} = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

  return <>
    <UpgradeButton
      ref={refs.setReference}
      {...getReferenceProps()}
      bought={props.bought}
      onClick={props.onPurchase}
    >
      <Icon size="sm" icon={props.upgrade.icon} />
    </UpgradeButton>

    {isOpen &&
      <Tooltip ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
        <strong>{props.upgrade.name}</strong>
        <Description>{props.upgrade.description}</Description>
        
        {props.bought ?
          <div>Purchased!</div> :
          <Costs>
          {Object.entries(props.upgrade.cost)
            .map(([resource, cost]) => [enumFromKey(ResourceType, resource) as ResourceType, cost] as const)
            .map(([resource, cost]) => 
              <CostLine key={resource}>
                <Icon size="xs" icon={resourceIconMap[resource]} />
                <span>{cost}</span>
              </CostLine>
          )}
          </Costs>
        }
      </Tooltip>
    }
  </>;
}

const Container = styled.div`
  width: 240px;
`;

const UpgradeList = styled.div`
  display: flex;
  gap: 6px;
`;

const TechAgeSection = styled.div`
  margin-bottom: 20px;
`;

const UpgradeButton = styled.button<{bought: boolean}>`
  width: 40px;
  height: 40px;
  border: 1px solid #999;
  background-color: #333;
  border-radius: 3px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;


  ${p => p.bought ? css`
    border-color: white;
  ` : css`
    filter: opacity(0.5);
    &:hover {
      filter: opacity(0.9);
    }
  `}
`;

const Tooltip = styled.div`
  width: 200px;
  background-color: #222;
  border-radius: 5px;
  padding: 10px;
  color: white;
  z-index: 10;
`;

const Description = styled.p`
  color: #AAA;
  font-size: 15px;
`

const Costs = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CostLine = styled.div`
  display: flex;
  gap: 3px;
`;

const MegaUpgradesContainer = styled.div`
  margin-top: 12px;
`;

const MegaUpgradesTitle = styled.strong`
  display: block;
  color: #AAA;
  margin-bottom: 4px;
`;

const MegaUpgradesList = styled.div`
  border: 1px solid #777;
  border-radius: 5px;
  padding: 6px;
  display: inline-block;
`;