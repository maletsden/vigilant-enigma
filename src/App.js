import React from 'react';
import './App.css';
import Player from "./components/Player/Player";

function App() {
  return (
    <div className="App">
      <Player size={800} audioSrc="/jack-over.mp3" chordsData={[]}/>
      <Player size={800} audioSrc="/jack-over.mp3" chordsData={[
        [10.38, 72.62],
        [40.59, 141.5],
        [44.34, 91.12],
        [49.03, 186.84],
        [49.06, 95.84],
        [57.5, 187.56],
        [95.25, 149.38]
      ]}/>
    </div>
  );
}

export default App;
