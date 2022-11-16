import { pick } from "lodash";
import styled from "styled-components";
import shallow from "zustand/shallow";
import { BUILDING_BLUE } from "../../shared/constants";
import useStore from "../../store";

export default function RewardsPage() {
  const combat = useStore(s => pick(
    s.combat, ['claimRewards']
  ), shallow);

  return <Page>
    <h1>Congratulations!</h1>

    <ClaimButton onClick={combat.claimRewards}>Claim your rewards</ClaimButton>
  </Page>
}

const Page = styled.div`
`;

const ClaimButton = styled.button`
  width: 100px;
  height: 40px;
  background-color: ${BUILDING_BLUE};
`;