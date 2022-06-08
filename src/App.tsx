import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import {GridProvider} from './contexts/grid';
import Grid from './components/grid';
import CardList from './components/card-list';
import { CardsProvider } from './contexts/cards';
import CardPacks from './components/card-packs';

function App() {
  return (
    <GridProvider>
    <CardsProvider>
      <div className="App">
        <CardPacks />
        <Grid />
        <CardList />
      </div>
    </CardsProvider>
    </GridProvider>
  );
}

export default App;
