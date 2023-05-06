import { pick } from "lodash";
import styled, { css } from "styled-components";
import upgradesConfig from "../../config/upgrades";
import Icon from "../../shared/components/icon";
import useStore from "../../store";
import { SectionHeader } from "../shared/common-styles";

export default function Upgrades() {
  const upgrades = useStore(s => s.upgrades);

  return <Container>
    <SectionHeader>Upgrades</SectionHeader>

    <UpgradeList>
      {Object.values(upgradesConfig).map((up) => 
        <Upgrade bought={upgrades.purchasedUpgrades[up.id]} onClick={() => upgrades.purchaseUpgrade(up.id)}>
          <Icon size="sm" icon={up.icon} />
        </Upgrade>
      )}
    </UpgradeList>
  </Container>
}

const Container = styled.div`
  width: 240px;
`;

const UpgradeList = styled.div`
  display: flex;
  gap: 6px;
`;

const Upgrade = styled.div<{bought: boolean}>`
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