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
  const isPrestigeOpen = useStore(s => s.prestige.isMenuOpen);

  return <div className="content">
    {isPrestigeOpen ? 
      <Prestige /> :
      <>
        <CardPacks />
        <Grid />
        <CardList />
      </>
    }
  </div>;
}

export default App;
