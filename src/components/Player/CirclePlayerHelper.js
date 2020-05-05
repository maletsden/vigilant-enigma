export default class CirclePlayerHelper {
  static polarToCartesian(center, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: center.x + (radius * Math.cos(angleInRadians)),
      y: center.y + (radius * Math.sin(angleInRadians))
    };
  }

  static describeArc(startAngle, endAngle, center, radius) {
    const start = CirclePlayerHelper.polarToCartesian(center, radius, endAngle);
    const end = CirclePlayerHelper.polarToCartesian(center, radius, startAngle);

    const largeArcFlag = +!(endAngle - startAngle <= 180);

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  static updateArc(arc, d, strokeColor, strokeWidth) {
    arc.setAttribute('d', d);
    arc.setAttribute('stroke', strokeColor);
    arc.setAttribute('stroke-width', strokeWidth)
  }
}