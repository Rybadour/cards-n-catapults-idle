import { pick } from "lodash";
import styled from "styled-components";
import shallow from "zustand/shallow";
import allCardsConfig from "../../config/cards";
import Icon from "../../shared/components/icon";
import { BUILDING_BLUE } from "../../shared/constants";
import useStore from "../../store";

export default function RewardsPage() {
  const combat = useStore(s => pick(
    s.combat, ['encounter', 'claimRewards']
  ), shallow);

  return <Page>
    <h2>Congratulations!</h2>

    <p>You get:</p>

    <RewardList>
      {combat.encounter?.rewards.cards ? 
        Object.entries(combat.encounter?.rewards.cards).map(([cardId, num]) => 
          <Reward id={"cardReward_" + cardId}>
            <RewardIcon>
              <Icon icon={allCardsConfig[cardId].icon} size="md" />
            </RewardIcon>
            <RewardTitle>{allCardsConfig[cardId].name} card</RewardTitle>
            <RewardAmount>x{num}</RewardAmount>
          </Reward>
        ): null
      }
      {combat.encounter?.rewards.unlockedCards ? 
        combat.encounter?.rewards.unlockedCards.map((cardId) => {
          return <Reward id={"unlockCardReward_" + cardId}>
            <RewardIcon>
              <Icon icon={allCardsConfig[cardId].icon} size="md" />
            </RewardIcon>
            <RewardTitle>Unlocked {allCardsConfig[cardId].name}</RewardTitle>
          </Reward>;
        }): null
      }
    </RewardList>

    <ClaimButton onClick={combat.claimRewards}>Claim your rewards</ClaimButton>
  </Page>
}

const Page = styled.div`
`;

const ClaimButton = styled.button`
  width: 100px;
  height: 40px;
  background-color: ${BUILDING_BLUE};
  outline: none;
  border: none;
  border-radius: 3px;
  &:hover {
    border: 1px solid white;
  }
`;

const RewardList = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
`;

const Reward = styled.div`
  width: 140px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background-color: #555;
  border-radius: 3px;
  padding: 8px;
`;

const RewardIcon = styled.div`
  margin-top: 10px;
  margin-bottom: auto;
`;

const RewardTitle = styled.p`
  margin: 0;
  text-align: center;
`;

const RewardAmount = styled.p`
  margin: 0;
  color: #BBB;
`;