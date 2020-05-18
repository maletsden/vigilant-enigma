import React from 'react';
import './App.css';
import Player from "./components/Player/Player";
import Box from "@material-ui/core/Box";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSize: this.calcPlayerSize()
    };
  }

  calcPlayerSize() {
    return Math.min(window.innerWidth * .8, 600);
  }

  render() {
    return (
      <div className="App">
        <Box mb={3}/>
        <Player size={this.state.playerSize} audioSrc="/jack-over.mp3" chordsData={[]}/>
        <Box mb={10}/>

        <Player size={this.state.playerSize} audioSrc="/jack-over.mp3" chordsData={[
          [10.38, 72.62],
          [40.59, 141.5],
          [44.34, 91.12],
          [49.03, 186.84],
          [49.06, 95.84],
          [57.5, 187.56],
          [95.25, 149.38]
        ]}/>
        <Box mb={10}/>
        <Player size={this.state.playerSize} audioSrc={''} chordsData={[]}/>
      </div>
    );
  }
}