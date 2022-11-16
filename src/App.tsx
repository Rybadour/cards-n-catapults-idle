import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

import Header from './components/header/header';
import Prestige from './components/prestige';
import ReactTooltip from 'react-tooltip';
import useStore from './store';

import './App.scss';
import { Scene } from './store/scenes';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { CombatScene } from './components/combat/combat-scene';
import TownScene from './components/town/town-scene';

function App() {
  return (
    <div className="App">
      <Header />

      <Content />

      <ReactTooltip place="bottom" effect="solid" className="standard-tooltip" />

      <footer>
        <div className="attribution">
          Game icons provided by <a href="https://game-icons.net/">game-icons.net</a>
          under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
        </div>
      </footer>
    </div>
  );
}

let lastTime: number = Date.now();
function Content() {
  const scene = useStore(s => s.scenes.currentScene);

  const updateSaving = useStore(s => s.savingLoading.update);
  const updatePrestige = useStore(s => s.prestige.update);
  const updateCombat = useStore(s => s.combat.update);
  const updateGrid = useStore(s => s.cardGrids.updateAll);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      updateGrid(elapsed);
      updatePrestige();
      updateCombat(elapsed);
      updateSaving(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [updateGrid, updatePrestige, updateSaving]);

  const sceneMap: Record<Scene, ReactJSXElement> = {
    [Scene.Economy]: <TownScene />,
    [Scene.Prestige]: <Prestige />,
    [Scene.Combat]: <CombatScene />,
  }

  return <div className="content">
    {sceneMap[scene]}
  </div>;
}

export default App;
