import { useCallback, useContext } from "react";

import { AUTO_SAVE_TIME, SavingLoadingContext } from "../../contexts/saving-loading";
import VerticalTabs, { Tab } from "../../shared/components/vertical-tabs";
import { formatNumber } from "../../shared/utils";
import './options-modal.scss';

function OptionsModal() {
  const savingLoading = useContext(SavingLoadingContext);
  const onSave = useCallback(() => {
    savingLoading.save();
  }, [savingLoading]);
  const onLoad = useCallback(() => {
    savingLoading.load();
  }, [savingLoading]);
  const onReset = useCallback(() => {
    savingLoading.completeReset();
  }, [savingLoading]);
  const onToggleAutoSave = useCallback(() => {
    savingLoading.setIsAutoSaveEnabled(!savingLoading.isAutoSaveEnabled);
  }, [savingLoading]);

  const tabs: Tab[] = [{
    title: "Save Data",
    content: <>
      <h3>Saving and Loading Settings</h3>
      <label>
        <span>Auto-save every {AUTO_SAVE_TIME/1000} seconds?</span>
        <input type="checkbox" checked={savingLoading.isAutoSaveEnabled} onChange={() => onToggleAutoSave()} />
      </label>
      {savingLoading.isAutoSaveEnabled ?
        <div>Next save in {formatNumber(savingLoading.autoSaveTime/1000, 0, 0)} seconds.</div> :
        <div>(Autosave is disabled)</div>
      }

      <h3>Import/Export</h3>

      <h3>Manual controls</h3>
      <div className="save-buttons">
        <button onClick={() => onSave()}>Save</button>
        <button onClick={() => onLoad()}>Load</button>
        <button onClick={() => onReset()}>Complete Reset</button>
      </div>
    </>
  }];

  return <div className="options-modal">
    <h2>Options</h2>

    <VerticalTabs tabs={tabs} />
  </div>;
}

export default OptionsModal;