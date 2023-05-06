import styled, { css } from "styled-components";
import {useFloating, useHover, useInteractions} from '@floating-ui/react';

import upgradesConfig from "../../config/upgrades";
import Icon from "../../shared/components/icon";
import useStore from "../../store";
import { SectionHeader } from "../shared/common-styles";
import { useState } from "react";
import { PrestigeUpgrade } from "../../shared/types";

export default function Upgrades() {
  const upgrades = useStore(s => s.upgrades);

  return <Container>
    <SectionHeader>Upgrades</SectionHeader>

    <UpgradeList>
      {Object.values(upgradesConfig).map((up) => 
        <Upgrade
          key={up.id}
          upgrade={up}
          bought={upgrades.purchasedUpgrades[up.id]}
          onPurchase={() => upgrades.purchaseUpgrade(up.id)}
        />
      )}
    </UpgradeList>
  </Container>
}

function Upgrade(props: {upgrade: PrestigeUpgrade, bought: boolean, onPurchase: () => void}) {
  const [isOpen, setIsOpen] = useState(false);
  const {refs, floatingStyles, context} = useFloating({
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
      <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
        {props.upgrade.name}
      </div>
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
  border-radius: 3px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${p => p.bought ? css`
    border-color: white;
  ` : ''}
`;