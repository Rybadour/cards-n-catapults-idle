import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import {GridProvider} from './contexts/grid';
import Grid from './components/grid';

function App() {
  return (
    <GridProvider>
      <div className="App">
        <Grid />
      </div>
    </GridProvider>
  );
}

export default App;
