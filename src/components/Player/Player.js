import React from 'react';
import CirclePlayer from "./CirclePlayer";

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    this.circlePlayerRef = React.createRef();
    this.circleRendered = false;
    this.circleArcDuration = 250; // in milliseconds
    this.audioContextRef = React.createRef();

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
    const audioContext = this.audioContextRef.current;

    audioContext.load();

    audioContext.addEventListener('canplaythrough', () => {
      this.setState({
        ...this.state,
        duration: this.audioContextRef.current.duration
      });

      if (!this.circleRendered) {
        this.circleArcNumber = parseInt(this.state.duration) * Math.floor(1000 / this.circleArcDuration);
        this.circlePlayerRef.current.renderPlayer(this.circleArcNumber);
        this.circleRendered = true;
      }
    });

    audioContext.addEventListener('timeupdate', () => {
      this.setState({
        ...this.state,
        currentTime: this.audioContextRef.current.currentTime
      });

      if(this.circleRendered) {
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

  render() {
    return (
      <div>
        <div>
          Duration: {this.state.duration}
        </div>
        <div>
          Current duration: {this.state.currentTime}
        </div>

        <CirclePlayer ref={this.circlePlayerRef} size={this.props.size} changePlayerPointerPosition={(arcIndex) => this.changePlayerPointerPosition(arcIndex)}/>
        <audio ref={this.audioContextRef} src={this.props.audioSrc} controls/>

      </div>
    );
  }
}