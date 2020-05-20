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

        <Player size={this.state.playerSize} audioSrc="/deja-vu.wav" chordsData={[
          [27, 226.5], [29, 228.5],
          [31, 230.5], [33, 232.5],
          [35, 100.5], [37, 102.5],
          [50.25, 115.75], [52.25, 117.75],
          [54.25, 119.75], [56.25, 121.75],
          [58.25, 123.75], [63.5, 129],
          [65.5, 145], [67.5, 147],
          [69.5, 149], [71.5, 151],
          [73.5, 153], [75.5, 141],
          [77.5, 143], [79.5, 145],
          [81.5, 147], [83.5, 149],
          [85.5, 151], [87.5, 153]
        ]}/>

        <Box mb={10}/>

        <Player size={this.state.playerSize} audioSrc="/last_track_example.wav" chordsData={[
          [8, 26.5], [10, 50.5],
          [12, 83.99], [14, 31.5],
          [16, 80.99], [18, 35.25],
          [20, 87.49], [22, 84.49],
          [24, 86.49], [26, 51.75],
          [28, 84.99], [30, 59.49],
          [32, 82.99], [34, 64.24],
          [36, 84.74], [38, 75.24],
          [40, 89.24], [42, 55.49],
          [44, 90.24], [46, 56.24],
          [48, 75.49], [50, 84.99],
          [52, 75.74], [54, 75.24]
        ]}/>
      </div>
    );
  }
}