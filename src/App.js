import React from 'react';
import './App.css';
import Player from "./components/Player/Player";

function App() {
  return (
    <div className="App">
      <Player size={800} audioSrc="/track.mp3"/>
    </div>
  );
}

export default App;
