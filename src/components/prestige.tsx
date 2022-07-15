import { useCallback, useContext } from "react";
import { PrestigeContext } from "../contexts/prestige";
import { formatNumber } from "../shared/utils";
import './prestige.scss';

export default function Prestige() {
  const prestige = useContext(PrestigeContext);

  const closeMenu = useCallback(() => {
    prestige.closeMenu();
  }, [prestige]);

  const onBuyPack = useCallback((pack) => {
    prestige.buyPack(pack);
  }, [prestige]);

  return <div className="prestige-page">
    <div className="header">
      <h3>Prestige Upgrades</h3>

      <div className="points">
        You have <b>{prestige.prestigePoints}</b> prestige points.
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

        <p>Upgrades go here!</p>
      </div>
    </div>
  </div>;
}