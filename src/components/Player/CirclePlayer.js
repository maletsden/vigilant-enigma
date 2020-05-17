import React from "react";

import CirclePlayerHelper from "./CirclePlayerHelper";

// [startPoint, endPoint, probability]
const chordsData = [
  [12, 174, 87],
  [43, 122, 75],
  [354, 754, 43],
  [583, 13, 78],
  [734, 434, 65],
  [323, 23, 82],
  [12, 543, 56],
  [433, 832, 65]
];

export default class CirclePlayer extends React.Component {
  constructor(props) {
    super(props);

    const size = parseInt(props.size);
    const arcBasicStrokeWidth = size * .016;
    const arcHoverStrokeWidth = arcBasicStrokeWidth * 5;
    const arcActiveStrokeWidth = arcBasicStrokeWidth * 3;

    this.circleData = {
      radius: (size / 2) - (arcHoverStrokeWidth * 1.2),
      center: {
        x: size / 2,
        y: size / 2
      }
    };
    this.currentActiveArcIndex = 0;
    this.currentActiveChordIndex = 0;
    this.svgRef = React.createRef();

    this.arcBasicStrokeWidth = arcBasicStrokeWidth;
    this.arcHoverStrokeWidth = arcHoverStrokeWidth;
    this.arcActiveStrokeWidth = arcActiveStrokeWidth;

    this.arcBasicDRadius = this.circleData.radius + (this.arcBasicStrokeWidth / 2);
    this.arcHoverDRadius = this.circleData.radius + (this.arcHoverStrokeWidth / 2);
    this.arcActiveDRadius = this.circleData.radius + (this.arcActiveStrokeWidth / 2);

    this.arcBasicColor = 'blue';
    this.arcHoverColor = 'green';
    this.arcActiveColor = 'red';
    this.arcVisitedColor = 'purple';

    this.chordBasicColor = 'black';
    this.chordHoverColor = 'green';
    this.chordActiveColor = 'red';


  }

  createNewArc(index, ...args) {
    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");

    arc.basicD = CirclePlayerHelper.describeArc(...args, this.circleData.center, this.arcBasicDRadius);
    arc.hoverD = CirclePlayerHelper.describeArc(...args, this.circleData.center, this.arcHoverDRadius);
    arc.activeD = CirclePlayerHelper.describeArc(...args, this.circleData.center, this.arcActiveDRadius);

    arc.arcIndex = index;

    CirclePlayerHelper.updateArc(arc, arc.basicD, this.arcBasicColor, this.arcBasicStrokeWidth);

    arc.addEventListener('mouseover', () => {
      CirclePlayerHelper.updateArc(arc, arc.hoverD, this.arcHoverColor, this.arcHoverStrokeWidth);
    });

    arc.addEventListener('mouseleave', () => {
      let strokeColor = this.arcBasicColor;
      let strokeWidth = this.arcBasicStrokeWidth;
      let d = arc.basicD;

      if (arc.isVisited) {
        strokeColor = this.arcVisitedColor;
      }

      if (arc.isActive) {
        strokeColor = this.arcActiveColor;
        strokeWidth = this.arcActiveStrokeWidth;
        d = arc.activeD;
      }

      CirclePlayerHelper.updateArc(arc, d, strokeColor, strokeWidth);
    });

    arc.addEventListener('click', () => this.props.changePlayerPointerPosition(arc.arcIndex));

    this.svgRef.current.appendChild(arc);

    return arc;
  }

  createArcs(samplesNumber) {
    this.renderedArcs = new Array(samplesNumber);

    const CircleDegrees = 360;
    const step = CircleDegrees / samplesNumber;

    let angle = 0;
    for (let i = 0; i < samplesNumber - 1; ++i) {
      this.renderedArcs[i] = this.createNewArc(i, angle, angle + step);
      angle += step;
    }

    this.renderedArcs[samplesNumber - 1] = this.createNewArc(samplesNumber, angle, CircleDegrees);
  }

  updateActiveArc(arcIndex) {
    const oldActiveArc = this.renderedArcs[this.currentActiveArcIndex];
    oldActiveArc.isVisited = true;
    oldActiveArc.isActive = false;
    CirclePlayerHelper.updateArc(oldActiveArc, oldActiveArc.basicD, this.arcVisitedColor, this.arcBasicStrokeWidth);

    this.currentActiveArcIndex = arcIndex;

    const currentArc = this.renderedArcs[this.currentActiveArcIndex];
    CirclePlayerHelper.updateArc(currentArc, currentArc.activeD, this.arcActiveColor, this.arcActiveStrokeWidth);
    currentArc.isActive = true;
  }

  updateActiveChord(arcIndex) {
    const chord = this.renderedChords[arcIndex];
    const oldChord = this.renderedChords[this.currentActiveChordIndex];

    if (oldChord) oldChord.setAttribute('stroke', this.chordBasicColor);
    if (!chord) return;

    this.currentActiveChordIndex = arcIndex;

    chord.setAttribute('stroke', this.chordActiveColor);

    const [nextArcIndex, probability] = this.renderedChordsData[arcIndex];

    if (Math.random() * 100 <= probability) {
      return nextArcIndex;
    }
  }

  updateActiveState(arcIndex) {
    this.updateActiveArc(arcIndex);
    return this.updateActiveChord(arcIndex);
  }
  createNewChord(chordCoords) {
    const firstPoint = CirclePlayerHelper.polarToCartesian(this.circleData.center, this.circleData.radius, chordCoords[0] / this.intervalsNumber * 360)
    const secondPoint = CirclePlayerHelper.polarToCartesian(this.circleData.center, this.circleData.radius, chordCoords[1] / this.intervalsNumber * 360)

    const chord = document.createElementNS("http://www.w3.org/2000/svg", "path");

    chord.setAttribute('d', `M ${firstPoint.x} ${firstPoint.y} Q ${this.circleData.center.x} ${this.circleData.center.y} ${secondPoint.x} ${secondPoint.y}`);
    chord.setAttribute('stroke', this.chordBasicColor);
    chord.setAttribute('stroke-width', '2');
    chord.setAttribute('fill', 'transparent');

    this.svgRef.current.appendChild(chord);

    return chord;
  }
  createChords() {
    this.renderedChords = new Array(this.intervalsNumber);
    this.renderedChordsData = new Array(this.intervalsNumber).fill(null).map(() => new Uint32Array(2));

    for (let chordCoords of (this.chordsData.length ? this.chordsData : chordsData)) {
      // start point
      this.renderedChordsData[chordCoords[0]][0] = chordCoords[1];
      // probability
      this.renderedChordsData[chordCoords[0]][1] = chordCoords[2];

      this.renderedChords[chordCoords[0]] = this.createNewChord(chordCoords);
    }
  }
  renderPlayer(samplesNumber, chordsData) {
    this.intervalsNumber = samplesNumber;

    this.chordsData = chordsData;
    this.createArcs(samplesNumber);
    this.createChords();
  }

  render() {
    return (
      <svg ref={this.svgRef} height={this.props.size} width={this.props.size}>
        <circle
          cx={this.circleData.center.x} cy={this.circleData.center.y}
          r={this.circleData.radius} fill="transparent"
        />
      </svg>
    );
  }
}

