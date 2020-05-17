import React from 'react';
import CirclePlayer from "./CirclePlayer";
import {Box} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import Uploader from "./Uploader/Uploader";

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    this.circlePlayerRef = React.createRef();
    this.circleRendered = false;
    this.circleArcDuration = 250; // in milliseconds
    this.audioContextRef = React.createRef();
    this.circlePlayerBox = React.createRef();

    this.state = {
      currentTime: 0,
      duration: 0
    }

  }

  audioCurrentTimeToCircleArc(time) {
    return Math.min(Math.floor((time * 1000) / this.circleArcDuration), this.circleArcNumber - 1);
  }

  circleArcToAudioCurrentTime(arcIndex) {
    return arcIndex * (this.circleArcDuration / 1000);
  }

  componentDidMount() {
    if (this.props.audioSrc) {
      this.renderAudioPlayer();
    }
  }

  renderAudioPlayer() {
    const audioContext = this.audioContextRef.current;

    audioContext.load();

    audioContext.addEventListener('canplaythrough', () => {
      this.setState({
        ...this.state,
        duration: this.audioContextRef.current.duration
      });

      if (!this.circleRendered) {
        this.circleArcNumber = parseInt(this.state.duration) * Math.floor(1000 / this.circleArcDuration);
        const chordsData = this.chordsDataTimeToArcs();
        this.circlePlayerRef.current.renderPlayer(this.circleArcNumber, chordsData);
        this.circleRendered = true;
      }
    });

    audioContext.addEventListener('timeupdate', () => {
      this.setState({
        ...this.state,
        currentTime: this.audioContextRef.current.currentTime
      });

      if (this.circleRendered) {
        const nextArcIndex = this.circlePlayerRef.current.updateActiveState(
          this.audioCurrentTimeToCircleArc(this.audioContextRef.current.currentTime)
        );

        if (typeof nextArcIndex === 'number') {
          this.changePlayerPointerPosition(nextArcIndex + 1);
        }
      }
    });
  }

  changePlayerPointerPosition(arcIndex) {
    this.audioContextRef.current.currentTime = this.circleArcToAudioCurrentTime(arcIndex);
  }

  chordsDataTimeToArcs() {
    return this.props.chordsData.map(interval => [
      ...interval.map(this.audioCurrentTimeToCircleArc.bind(this)),
      50 + Math.round(Math.random() * 50) // probability
    ]);
  }

  render() {
    return (
      <div>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <div>
            Duration: {this.state.duration}
          </div>
          <Box mb={3}/>
          <div>
            Current duration: {this.state.currentTime}
          </div>

          {
            this.props.audioSrc ?
              (<CirclePlayer
                ref={this.circlePlayerRef}
                size={this.props.size}
                changePlayerPointerPosition={(arcIndex) => this.changePlayerPointerPosition(arcIndex)}
                style={{
                  display: this.props.audioSrc ? 'block' : 'none'
                }}
              />) : null
          }


          {
            !this.props.audioSrc ?
              (<Uploader
                style={{
                  display: !this.props.audioSrc ? 'block' : 'none'
                }}
                size={this.props.size}
              />) : null
          }


          <audio ref={this.audioContextRef} src={this.props.audioSrc} controls/>
        </Grid>
      </div>
    );
  }
}