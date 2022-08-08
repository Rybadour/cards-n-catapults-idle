import React, { useContext } from 'react';
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
import Header from './components/header/header';
import { PrestigeContext, PrestigeProvider } from './contexts/prestige';
import Prestige from './components/prestige';
import ReactTooltip from 'react-tooltip';
import { SavingLoadingProvider } from './contexts/saving-loading';
import { CardMasteryProvider } from './contexts/card-mastery';

function App() {
  return (
    <DiscoveryProvider>
    <StatsProvider>
    <CardsProvider>
    <CardMasteryProvider>
    <CardPacksProvider>
    <GridProvider>
    <PrestigeProvider>
    <SavingLoadingProvider>
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
    </SavingLoadingProvider>
    </PrestigeProvider>
    </GridProvider>
    </CardPacksProvider>
    </CardMasteryProvider>
    </CardsProvider>
    </StatsProvider>
    </DiscoveryProvider>
  );
}

function Content() {
  const prestige = useContext(PrestigeContext);

  return <div className="content">
    {prestige.isMenuOpen ? 
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
