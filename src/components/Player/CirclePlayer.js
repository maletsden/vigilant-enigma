import React from "react";

import CirclePlayerHelper from "./CirclePlayerHelper";

export default class CirclePlayer extends React.Component {
  constructor(props) {
    super(props);

    const size = parseInt(props.size);
    this.circleData = {
      radius: (size / 2) * 0.6,
      center: {
        x: size / 2,
        y: size / 2
      }
    };

    this.currentActiveArcIndex = 0;
    this.svgRef = React.createRef();

    this.arcBasicStrokeWidth = 10;
    this.arcHoverStrokeWidth = this.arcBasicStrokeWidth * 5;
    this.arcActiveStrokeWidth = this.arcBasicStrokeWidth * 3;

    this.arcBasicDRadius = this.circleData.radius + (this.arcBasicStrokeWidth / 2);
    this.arcHoverDRadius = this.circleData.radius + (this.arcHoverStrokeWidth / 2);
    this.arcActiveDRadius = this.circleData.radius + (this.arcActiveStrokeWidth / 2);


    this.arcBasicColor = 'blue';
    this.arcHoverColor = 'green';
    this.arcActiveColor = 'red';
    this.arcVisitedColor = 'purple';
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

  renderPlayer(samplesNumber) {
    this.renderedArcs = new Array(samplesNumber);
    this.createArcs(samplesNumber);
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

