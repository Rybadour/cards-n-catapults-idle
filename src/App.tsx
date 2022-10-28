import React from 'react';
import ReactDOM from "react-dom";

import Grid from './components/grid';
import CardList from './components/card-list';
import CardPacks from './components/card-packs';
import Header from './components/header/header';
import Prestige from './components/prestige';
import ReactTooltip from 'react-tooltip';
import useStore from './store';

import './App.scss';
import { Scene } from './store/scenes';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { CombatScene } from './components/combat/combat-scene';

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

function Content() {
  const scene = useStore(s => s.scenes.currentScene);

  const sceneMap: Record<Scene, ReactJSXElement> = {
    [Scene.Economy]: <>
      <CardPacks />
      <Grid />
      <CardList />
    </>,
    [Scene.Prestige]: <Prestige />,
    [Scene.Combat]: <CombatScene />,
  }

  return <div className="content">
    {sceneMap[scene]}
  </div>;
}

export default App;
