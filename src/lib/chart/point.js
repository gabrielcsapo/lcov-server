import React from 'react';

const Point = React.createClass({
  propTypes: {
    point: React.PropTypes.array,
    stroke: React.PropTypes.number,
    radius: React.PropTypes.number,
  },

  defaultProps: {
    point: [],
    stroke: 0,
    radius: 0,
  },

	mouseEnter() {
		this.props.showTooltip(this.props.point, this.props.dataSetIndex, this.props.index)
	},

	mouseLeave() {
		this.props.hideTooltip()
	},

	render() {
    const { point, stroke, radius } = this.props;
    const x = point[0];
    const y = point[1];
    const color = point[3];

		return <circle
			cx={ x }
      cy={ y }
			r={ radius }
      fill={ color }
			strokeWidth={ stroke }
      stroke={ '#ffffff' }
			onMouseEnter={ this.mouseEnter }
      onMouseLeave={ this.mouseLeave }
    />
	}
});

module.exports = Point;
