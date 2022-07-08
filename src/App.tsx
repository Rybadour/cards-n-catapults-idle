import React from 'react';
import ReactDOM from "react-dom";
import './App.scss';
import {GridProvider} from './contexts/grid';
import Grid from './components/grid';
import CardList from './components/card-list';
import { CardsProvider } from './contexts/cards';
import CardPacks from './components/card-packs';
import { StatsProvider } from './contexts/stats';
import { DiscoveryProvider } from './contexts/discovery';
import { CardPacksProvider } from './contexts/card-packs';
import Header from './components/header';

function App() {
  return (
    <DiscoveryProvider>
    <StatsProvider>
    <CardsProvider>
    <CardPacksProvider>
    <GridProvider>
      <div className="App">
        <Header />

        <div className="content">
          <CardPacks />
          <Grid />
          <CardList />
        </div>

        <footer>
          <div className="attribution">
            Game icons provided by <a href="https://game-icons.net/">game-icons.net</a>
            under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
          </div>
        </footer>
      </div>
    </GridProvider>
    </CardPacksProvider>
    </CardsProvider>
    </StatsProvider>
    </DiscoveryProvider>
  );
}

export default App;
