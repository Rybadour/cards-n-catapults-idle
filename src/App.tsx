import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import {GridProvider} from './contexts/grid';
import Grid from './components/grid';
import CardList from './components/card-list';

function App() {
  return (
    <GridProvider>
      <div className="App">
        <Grid />
        <CardList />
      </div>
    </GridProvider>
  );
}

export default App;
