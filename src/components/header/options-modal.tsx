import classNames from "classnames";
import { useCallback, useContext, useState } from "react";

import { AUTO_SAVE_TIME, SavingLoadingContext } from "../../contexts/saving-loading";
import VerticalTabs, { Tab } from "../../shared/components/vertical-tabs";
import { formatNumber } from "../../shared/utils";
import './options-modal.scss';

function OptionsModal() {
  const savingLoading = useContext(SavingLoadingContext);
  const [importData, setImportData] = useState("");
  const [exportData, setExportData] = useState("");

  const onToggleAutoSave = useCallback(() => {
    savingLoading.setIsAutoSaveEnabled(!savingLoading.isAutoSaveEnabled);
  }, [savingLoading]);

  const onImport = useCallback(() => {
    savingLoading.attemptImportData(importData);
  }, [savingLoading, importData]);
  const onExport = useCallback(() => {
    const saveData = savingLoading.getSaveData();
    setExportData(saveData);
    navigator.clipboard.writeText(saveData).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }, [savingLoading]);

  const onSave = useCallback(() => {
    savingLoading.save();
  }, [savingLoading]);
  const onLoad = useCallback(() => {
    savingLoading.load();
  }, [savingLoading]);
  const onReset = useCallback(() => {
    const codeWord = prompt("Are you sure!? Enter the word \"catapults\" to completely reset:");
    if (codeWord === 'catapults') {
      savingLoading.completeReset();
    }
  }, [savingLoading]);

  const tabs: Tab[] = [{
    title: "Save Data",
    content: <>
      <h3>Saving and Loading Settings</h3>
      <label>
        <span>Auto-save every {AUTO_SAVE_TIME/1000} seconds?</span>
        <input type="checkbox" checked={savingLoading.isAutoSaveEnabled} onChange={onToggleAutoSave} />
      </label>
      {savingLoading.isAutoSaveEnabled ?
        <div>Next save in {formatNumber(savingLoading.autoSaveTime/1000, 0, 0)} seconds.</div> :
        <div>(Autosave is disabled)</div>
      }

      <h3>Import/Export</h3>
      <div className="import">
        <input type="text" value={importData} onChange={(evt) => setImportData(evt.target.value)} />
        <button onClick={onImport}>Import</button>
      </div>
      <div className="export">
        <input type="text" readOnly value={exportData} />
        <button onClick={onExport}>Export</button>
        <span className={classNames("clipboard-badge", {show: exportData !== ''})}>Copied to Clipboard</span>
      </div>

      <h3>Manual controls</h3>
      <div className="save-buttons">
        <button onClick={onSave}>Save</button>
        <button onClick={onLoad}>Load</button>
        <button onClick={onReset}>Complete Reset</button>
      </div>
    </>
  }];

  return <div className="options-modal">
    <h2>Options</h2>

    <VerticalTabs tabs={tabs} />
  </div>;
}

export default OptionsModal;