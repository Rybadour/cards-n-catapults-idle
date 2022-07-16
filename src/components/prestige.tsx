import { useCallback, useContext } from "react";
import cards from "../config/cards";
import { PrestigeContext } from "../contexts/prestige";
import { PrestigeUpgrade, RealizedPrestigeUpgrade } from "../shared/types";
import { formatNumber } from "../shared/utils";
import './prestige.scss';

export default function Prestige() {
  const prestige = useContext(PrestigeContext);

  const onBuyPack = useCallback((pack) => {
    prestige.buyPack(pack);
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

            <button className="purchase-button" onClick={() => onBuyPack(pack)}>
              1 upgrade for {formatNumber(pack.cost, 0, 0)} points
            </button>
          </div>
        )}
        </div>
      </div>

      <div className="upgrades">
        <h3>Upgrades</h3>

        <div className="upgrade-list">
          {Object.entries(prestige.upgrades).map(([uId, upgrade]) =>
            <div className="upgrade-container" key={uId}>
              <div className="upgrade" >
                <div className="title">
                  <img src={`icons/${upgrade.icon}.png`} />
                  <span className="name">{upgrade.name}</span>
                  <span className="amount">{formatNumber(upgrade.quantity, 0, 0)}</span>
                </div>

                {upgrade.summary ?
                  <div className="ability-summary">{getSummary(upgrade)}</div> :
                  null
                }

                <div className="description">{upgrade.description}</div>
              </div>
            </div>
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
    let extraCardsSummary = Object.entries(upgrade.extraStartingCards)
      .map(([c, amount]) => 
        '+' + (amount * upgrade.quantity) + ' ' + cards[c].name
      ).join(', ');

    summary = summary.replaceAll('{{extraCards}}', extraCardsSummary);
  }

  return summary;
}