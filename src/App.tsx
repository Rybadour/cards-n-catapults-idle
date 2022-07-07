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
      </div>
    </GridProvider>
    </CardPacksProvider>
    </CardsProvider>
    </StatsProvider>
    </DiscoveryProvider>
  );
}

export default App;
