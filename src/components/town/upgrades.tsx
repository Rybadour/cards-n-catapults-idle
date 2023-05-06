import styled, { css } from "styled-components";
import {useFloating, useHover, useInteractions} from '@floating-ui/react';

import upgradesConfig from "../../config/upgrades";
import Icon from "../../shared/components/icon";
import useStore from "../../store";
import { SectionHeader } from "../shared/common-styles";
import { useCallback, useState } from "react";
import { ResourceType, TownUpgrade } from "../../shared/types";
import resourceIconMap from "../../config/resources";
import { enumFromKey } from "../../shared/utils";

export default function Upgrades() {
  const upgrades = useStore(s => s.upgrades);

  const onPurchase = useCallback((upId: string) => {
    upgrades.purchaseUpgrade(upId);
  }, [upgrades]);

  return <Container>
    <SectionHeader>Upgrades</SectionHeader>

    <UpgradeList>
      {Object.values(upgradesConfig).map((up) =>
        <Upgrade
          key={up.id}
          upgrade={up}
          bought={upgrades.purchasedUpgrades[up.id]}
          onPurchase={() => onPurchase(up.id)}
        />
      )}
    </UpgradeList>
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
    filter: saturate(0);
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