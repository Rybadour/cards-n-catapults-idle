import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import {GridProvider} from './contexts/grid';
import Grid from './components/grid';
import CardList from './components/card-list';
import { CardsProvider } from './contexts/cards';

function App() {
  return (
    <GridProvider>
    <CardsProvider>
      <div className="App">
        <Grid />
        <CardList />
      </div>
    </CardsProvider>
    </GridProvider>
  );
}

export default App;
