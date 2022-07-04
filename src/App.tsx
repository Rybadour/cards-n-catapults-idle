import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import {GridProvider} from './contexts/grid';
import Grid from './components/grid';
import CardList from './components/card-list';
import { CardsProvider } from './contexts/cards';
import CardPacks from './components/card-packs';
import { StatsProvider } from './contexts/stats';
import { DiscoveryProvider } from './contexts/discovery';
import { CardPacksProvider } from './contexts/card-packs';

function App() {
  return (
    <DiscoveryProvider>
    <StatsProvider>
    <CardsProvider>
    <CardPacksProvider>
    <GridProvider>
      <div className="App">
        <CardPacks />
        <Grid />
        <CardList />
      </div>
    </GridProvider>
    </CardPacksProvider>
    </CardsProvider>
    </StatsProvider>
    </DiscoveryProvider>
  );
}

export default App;
