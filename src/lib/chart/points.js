import React from 'react';
import Point from './point';

const Points = React.createClass({
  propTypes:  {
    points:  React.PropTypes.object,
    dataSetIndex: React.PropTypes.number,
    showTooltip: React.PropTypes.func,
    hideTooltip: React.PropTypes.func,
    radius: React.PropTypes.number,
    stroke: React.PropTypes.number,
    label: React.PropTypes.string,
    dots: React.PropTypes.boolean,
    hideLabels: React.PropTypes.boolean
  },

  defaultProps: {
    points: {},
    dataSetIndex: 0,
    showTooltip: () => {},
    hideTooltip: () => {},
    radius: 0,
    stroke: 0,
    label: '',
    dots: true,
    hideLabels: false
  },

	render() {
		let { points, dataSetIndex, showTooltip, hideTooltip, radius, stroke, label, dots, hideLabels } = this.props;

		let lastPoint = points[points.length - 1];
		let color = lastPoint[3];
		let x = lastPoint[0];
		let y = lastPoint[1];

		return (
			<g>
				{ dots === true ?
				points.map((p, pi) =>
					<Point
				 		point={ p }
						dataSetIndex={ dataSetIndex }
						showTooltip={ showTooltip }
						hideTooltip={ hideTooltip }
						stroke={ stroke }
						radius={ radius }
						index={ pi }
						key={ pi }
					/>)
				: null }

				{ hideLabels !== true ?
					<text className="LineChart--label" x={ x + 5 } y={ y + 2 } fill={ color }>{ label }</text>
				: null }
			</g>
		)
	}
});

module.exports = {
  Points
};
