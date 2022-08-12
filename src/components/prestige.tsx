import { useCallback, useContext, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import cards from "../config/cards";
import { totalUpgrades } from "../config/prestige-packs";
import { PrestigeContext } from "../contexts/prestige";
import Icon from "../shared/components/icon";
import { RealizedPrestigeUpgrade } from "../shared/types";
import { formatNumber } from "../shared/utils";
import './prestige.scss';

export default function Prestige() {
  const prestige = useContext(PrestigeContext);

  const onBuyPack = useCallback((pack) => {
    if (pack.remainingUpgrades.length > 0) {
      prestige.buyPack(pack);
    }
  }, [prestige]);

  const onRefund = useCallback((upgrade) => {
    prestige.refundUpgrade(upgrade);
  }, [prestige]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [prestige]);

  return <div className="prestige-page">
    <div className="header">
      <h3>Prestige Upgrades</h3>

      <div className="points">
        You have <b>{formatNumber(prestige.prestigePoints, 0, 0)}</b> prestige points.
      </div>
    </div>

    <div className="packs-and-upgrades">
      <div className="packs">
        <h3>Packs</h3>
        <div className="pack-list">
        {Object.values(prestige.packs).map(pack =>
          <div
            key={pack.id}
            className="pack"
          >
            <div className="name">{pack.name}</div>

            <div className="cards-left"><b>{pack.remainingUpgrades.length}</b> upgrades left in pack</div>

            {pack.remainingUpgrades.length > 0 ?
              <button className="purchase-button" onClick={() => onBuyPack(pack)}>
                1 upgrade for {formatNumber(pack.cost, 0, 0)} points
              </button> :
              null
            }
          </div>
        )}
        </div>
      </div>

      <div className="upgrades">
        <h3>Upgrades</h3>

        <div className="upgrade-list">
          {Object.values(prestige.packs).map(pack => 
            Object.entries(prestige.upgrades[pack.id]).map(([uId, upgrade]) =>
              <div className="upgrade-container" key={uId}>
                <div className="upgrade" >
                  <div className="title">
                    <Icon size="sm" icon={upgrade.icon} />
                    <span className="name">{upgrade.name}</span>
                    <span className="amount">{formatNumber(upgrade.quantity, 0, 0)}/{totalUpgrades[upgrade.id]}</span>
                  </div>

                  {upgrade.summary ?
                    <div className="summary">{getSummary(upgrade)}</div> :
                    null
                  }

                  <div className="description">{upgrade.description}</div>

                  <div className="buttons">
                    <button
                      className="on-card-button"
                      data-tip="Returns the upgrade back to its pack and refunds some prestige points."
                      onClick={() => onRefund(upgrade)}
                    >Return for {formatNumber(pack.refund, 0, 0)} points</button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  </div>;
}

function getSummary(upgrade: RealizedPrestigeUpgrade) {
  let summary = upgrade.summary;
  if (upgrade.bonus) {
    summary = summary.replaceAll(
      '{{bonusAsPercent}}',
      formatNumber((upgrade.bonus?.amount ?? 0) * 100 * upgrade.quantity, 0, 0) + '%'
    );
    summary = summary.replaceAll(
      '{{bonusAsAmount}}',
      formatNumber((upgrade.bonus?.amount ?? 0) * upgrade.quantity, 0, 0)
    );
  }

  if (upgrade.extraStartingCards) {
    const extraCardsSummary = Object.entries(upgrade.extraStartingCards)
      .map(([c, amount]) => 
        '+' + (amount * upgrade.quantity) + ' ' + cards[c].name
      ).join(', ');

    summary = summary.replaceAll('{{extraCards}}', extraCardsSummary);
  }

  return summary;
}